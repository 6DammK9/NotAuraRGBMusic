// hello.c
#include <stdio.h>
#include <emscripten/emscripten.h>
EMSCRIPTEN_KEEPALIVE float bezier1(float t, float p0, float p1) {
    return (1 - t) * p0 + t * p1;
}