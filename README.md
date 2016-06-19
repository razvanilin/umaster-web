<p align="center">
  <img src="https://raw.githubusercontent.com/razvanilin/umaster-client/master/client/app/images/logo-color.png" width="120"/>
</p>

# uMaster Web Client
uMaster is a PC/Web (mobile soon) application that allows you to use predefined scripts to create activities on your computer. These activities can be activated remotely through a web and mobile application (the later not yet implemented).

[PC client here](https://github.com/razvanilin/umaster-client)

**Actively developing on Windows, so OS X and Linux builds will not appear that often in the alpha stage**

* The web app can be found at: [umaster.razvanilin.com](umaster.razvanilin.com) where you can activate ativities on your PC
* The PC client can be found [here](https://github.com/razvanilin/umaster-client/releases). The PC activities are created there


# Wait, what?
The predefined scripts are included in the distribution of the software and these can be:

* **Lock script**: Allows you to create a lock activity that can be activated remotely (e.g. your phone)
* **Open App script**: Let's you choose what app you want to open on your PC (e.g. Spotify)
* **Open URL script**: Choose what URL you want to open in the default browser (e.g. your favorite YouTube playlist)

The above scripts are used for the development at the moment, but a lot of other ideas can be implemented. The configuration of the scripts is done in the `scriptsConf.json` file and it will allow easy plug-and-play for your own scripts.

# Is that even secure?
I'm still working on improving the security of the app, but yes, it is quite secure. The authentication is currently done through Google and Facebook oauth2; the activity requests are done through sockets which are checked on a central server.

There will also be a `Pin` feature which will be used to pair the devices. This Pin will not be stored on the server.

The scripts cannot be written or plugged in remotely through the apps, so nobody can write a script to cause any damage to your PC. The plan is to have a repository of scripts that can be selected by the users.

**This app is in the early development stage so expect many bugs along the way**
