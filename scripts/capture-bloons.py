"""Captura un cuadro de gameplay de Bloons TD (repo público AlsinaBautista/Bloons-TD-game-with-pygame).

Corre el juego sin ventana (SDL dummy), coloca dos torres y arranca la primera ronda con eventos
simulados, y guarda el cuadro en que hay globos en el camino.
Uso: python3 capture-bloons.py <carpeta del repo clonado> <carpeta de salida>   (requiere pygame-ce)
"""
import os, sys, runpy
os.environ["SDL_VIDEODRIVER"] = "dummy"
os.environ["SDL_AUDIODRIVER"] = "dummy"
import pygame
os.chdir(sys.argv[1]); sys.path.insert(0, os.getcwd())
OUT = sys.argv[2]
frame = [0]
pos = [(0, 0)]
orig_update = pygame.display.update
def click(p):
    pos[0] = p
    return pygame.event.Event(pygame.MOUSEBUTTONDOWN, pos=p, button=1)
script = {
    5: [click((900, 50))], 8: [click((150, 150))],
    12: [click((810, 50))], 15: [click((330, 300))],
    18: [click((900, 170))], 21: [click((450, 250))],
    24: [click((810, 170))], 27: [click((700, 330))],
    40: [click((725, 500))],
}
pygame.mouse.get_pos = lambda: pos[0]
def get():
    f = frame[0]
    ev = script.get(f, [])
    return ev
pygame.event.get = get
def upd(*a, **k):
    frame[0] += 1
    f = frame[0]
    if f == 300:
        pygame.image.save(pygame.display.get_surface(), f"{OUT}/bloons-gameplay.png")
    if f > 300:
        pygame.quit(); sys.exit(0)
    return orig_update(*a, **k)
pygame.display.update = upd
runpy.run_path("juego.py", run_name="__main__")
