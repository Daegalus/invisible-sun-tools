#!/bin/env python

from PIL import Image
from os import listdir,getcwd,mkdir
from os.path import isfile,join,basename
import glob
from pathlib import Path, PurePath
import argparse 
from progress.bar import ChargingBar

parser = argparse.ArgumentParser()
parser.add_argument("factor", type=float, help="The scaling factor to use. 1 = no change. 0.5 = 50% reduction")
parser.add_argument("-f", "--folder", default='.', help="The folder path where the images are stored. Default current directory.")
args = parser.parse_args()

source_folder = Path(args.folder)
resized_folder = source_folder.joinpath(Path("resized"))
resized_folder.mkdir(parents=True, exist_ok=True)

onlyfiles = [f for f in source_folder.glob("*.png") if Path.is_file(Path.joinpath(Path.cwd(), f))]
onlyfiles += [f for f in source_folder.glob("*.jpg") if Path.is_file(Path.joinpath(Path.cwd(), f))]

print(f"Resizing to ~{args.factor*100}%")

with ChargingBar('Processing', max=len(onlyfiles), suffix='%(percent).1f%% - %(index)d / %(max)d') as bar:
    for imageFile in onlyfiles:
        image = Image.open(imageFile)
        image = image.resize((int(image.width*args.factor),int(image.height*args.factor)), Image.LANCZOS)
        image.save(resized_folder.joinpath(basename(imageFile)))
        bar.next()