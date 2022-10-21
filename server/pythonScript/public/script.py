import os, sys
from pytube import YouTube
import pytube

def createDirectory(name):
    path = sys.path[0] # Take the complete directory to the location where the code is, you can substitute it to the place where you want to save the video.
    if not(os.path.isdir(f'{path}/{name}')): # Check if directory not exist
        path = os.path.join(sys.path[0], name) # Set the directory to the specified path and the name that was given to it
        os.mkdir(path) # Create a directory

def downloadVideoFromYoutube():
	link = sys.argv[1]
	yt = YouTube(link)
	video = yt.streams.get_highest_resolution();

	directoyName = sys.argv[2]

	createDirectory(directoyName)

	path = sys.path[0]
	video.download(output_path=f'{path}/{directoyName}')
	# Save the video in the newly created directory.

downloadVideoFromYoutube()