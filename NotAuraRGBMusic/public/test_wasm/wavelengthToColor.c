#include <stdlib.h>
#include <stdio.h>
#include <math.h>
#include <stdbool.h>
#include <emscripten/emscripten.h>

//Note: Everything will be in 64-bit a.k.a double! Make sure everything in JS is in Float64Array! 

//http://scienceprimer.com/javascript-code-convert-light-wavelength-color
// takes wavelength in nm and returns an rgba value
EMSCRIPTEN_KEEPALIVE double *wavelengthToColor(double* colorSpace, double wavelength) {
	double R = 0.0,
		G = 0.0,
		B = 0.0,
		alpha = 0.0,
		wl = wavelength,
		gamma = 1.0;

	if (wl >= 380 && wl < 440) {
		R = -1 * (wl - 440) / (440 - 380);
		G = 0;
		B = 1;
	}
	else if (wl >= 440 && wl < 490) {
		R = 0;
		G = (wl - 440) / (490 - 440);
		B = 1;
	}
	else if (wl >= 490 && wl < 510) {
		R = 0;
		G = 1;
		B = -1 * (wl - 510) / (510 - 490);
	}
	else if (wl >= 510 && wl < 580) {
		R = (wl - 510) / (580 - 510);
		G = 1;
		B = 0;
	}
	else if (wl >= 580 && wl < 645) {
		R = 1;
		G = -1 * (wl - 645) / (645 - 580);
		B = 0.0;
	}
	else if (wl >= 645 && wl <= 780) {
		R = 1;
		G = 0;
		B = 0;
	}
	else {
		R = 0;
		G = 0;
		B = 0;
	}

	// intensty is lower at the edges of the visible spectrum.
	if (wl > 780 || wl < 380) {
		alpha = 0;
	}
	else if (wl > 700) {
		alpha = (780 - wl) / (780 - 700);
	}
	else if (wl < 420) {
		alpha = (wl - 380) / (420 - 380);
	}
	else {
		alpha = 1;
	}

	//double colorSpace[4] = { R, G, B, alpha };
	//double *colorSpace = malloc(sizeof(double) * 5);
	//double colorSpace[5];
	colorSpace[0] = 0.0; //Was a unused string
	colorSpace[1] = R;
	colorSpace[2] = G;
	colorSpace[3] = B;
	colorSpace[4] = alpha;

	// colorSpace is an array with 5 elements.
	// The first element is the complete code as a string.
	// Use colorSpace[0] as is to display the desired color.
	// use the last four elements alone or together to access each of the individual r, g, b and a channels.

	return colorSpace;
}

EMSCRIPTEN_KEEPALIVE double pitch_fz(double* buf, int SIZE, int sampleRate, int MIN_SAMPLES, double GOOD_ENOUGH_CORRELATION) {
	//const SIZE = buf.length;
	//const MAX_SAMPLES = Math.floor(SIZE / 2);
	int MAX_SAMPLES = floor(SIZE / 2);
	//console.log(MAX_SAMPLES);

	int best_offset = -1;
	double best_correlation = 0;
	double rms = 0;
	bool foundGoodCorrelation = false;
	double *correlations = malloc(sizeof(double) * MAX_SAMPLES); //new Array(MAX_SAMPLES);
	double lastCorrelation = 1;
	double currentCorrelation = 0;
	double shift = 0;
	int offset = 0;
	int i = 0;

	for (i = 0; i < SIZE; i++) {
		rms += pow(buf[i], 2);
	}
	rms = sqrt(rms / SIZE);
	//g_result.rms = rms;
	//console.log(rms);
	if (rms < 0.01) // not enough signal
		return -1;//return { freq: -1, vol : rms };

	//console.log({MIN_SAMPLES,MAX_SAMPLES});

	for (offset = MIN_SAMPLES; offset < MAX_SAMPLES; offset++) {
		currentCorrelation = 0;

		for (i = 0; i < MAX_SAMPLES; i++) {
			currentCorrelation += fabs((buf[i]) - (buf[i + offset]));
		}

		//console.log(correlation);

		currentCorrelation = 1 - (currentCorrelation / MAX_SAMPLES);
		correlations[offset] = currentCorrelation; // store it, for the tweaking we need to do below.
		if ((currentCorrelation > GOOD_ENOUGH_CORRELATION) && (currentCorrelation > lastCorrelation)) {
			foundGoodCorrelation = true;
			if (currentCorrelation > best_correlation) {
				best_correlation = currentCorrelation;
				best_offset = offset;
			}
		}
		else if (foundGoodCorrelation) {
			// short-circuit - we found a good correlation, then a bad one, so we'd just be seeing copies from here.
			// Now we need to tweak the offset - by interpolating between the values to the left and right of the
			// best offset, and shifting it a bit.  This is complex, and HACKY in this code (happy to take PRs!) -
			// we need to do a curve fit on correlations[] around best_offset in order to better determine precise
			// (anti-aliased) offset.

			// we know best_offset >=1,
			// since foundGoodCorrelation cannot go to true until the second pass (offset=1), and
			// we can't drop into this clause until the following pass (else if).

			shift = (correlations[best_offset + 1] - correlations[best_offset - 1]) / correlations[best_offset];
			//console.log(correlation);
			//return { freq: (sampleRate / (best_offset + (8 * shift))), vol : rms };
			return (sampleRate / (best_offset + (8 * shift)));
		}
		lastCorrelation = currentCorrelation;
	}

	//When it's the very first band.
	if (best_correlation > 0.01) {
		//return { freq: (sampleRate / best_offset), vol : rms };
		return sampleRate / best_offset;
	}

	//console.log("f = " + sampleRate/best_offset + "Hz (rms: " + rms + " confidence: " + best_correlation + ")")
	//return { freq: -1, vol : rms };
	return -1;
	//	var best_frequency = sampleRate/best_offset;
}

EMSCRIPTEN_KEEPALIVE double vol_rms(double* VolArray, int ArrayLength) {
	double vol_sum = 0;
	int i = 0;
	for (i = 0; i < ArrayLength; i++) {
		vol_sum += pow(VolArray[i], 2);
	}
	return sqrt(vol_sum / ArrayLength);
}

//Pretty create conversion. Audible to visible.
// 20~20000Hz = -5 to 5 octave.
// 10000 - 40 = 9960
// 1 / ( 1 / 380 - 1 / 780 ) = 741
EMSCRIPTEN_KEEPALIVE double sound_freq_to_light_wavelength(double s_freq, double spectrum_base, double octave_range, double min_octave, double octave_relative_offset_low, double octave_relative_offset_high) {
	//It should able to be infinity.
	double octave = log(s_freq / spectrum_base) / log(2) - min_octave;
	double octave_scale = (octave_range - octave_relative_offset_high) / (octave + octave_relative_offset_low);
	return 1 / (1 / 780 + 1 / (741 * octave_scale));
};