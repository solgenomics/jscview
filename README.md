# Comparative map viewer 

Comparative Map Viewer (CMV), this is a fully BrAPI compliant tool for viewing and comparing genetic maps. This works with JavaScript, D3.js v4 and Bootstrap. Check CMV solgenomics <a href="http://maps.solgenomics.net">here</a>


## Documentation

Installation Manual (In progress)
===================

1. Catalyst and Perl dependencies
2. Code, in github https://github.com/solgenomics/jscview
3. Configuration file
4. BrAPI database

--------------------------------------------

1. Install Catalyst and Perl dependencies
--------------------------------------------

This web tool was developed using the <a href="http://www.catalystframework.org">Perl framework Catalyst</a>, so to run the application is necessary to install Perl, Catalyst and its dependencies.

Check <a href="http://www.catalystframework.org/#install">this link</a> in case of doubts installing Catalyst.

To install Catalyst using cpanm, just execute:
`cpanm Catalyst::Devel`


Also, if you are installing it in a new machine you maybe need to install cpanminus, gcc and make, and then some Perl dependencies like Catalyst, Lucy and Mason:

    sudo aptitude install cpanminus
    sudo aptitude install make
    sudo aptitude install gcc
    cpanm -L ~/local-lib/ Catalyst::Devel
    cpanm -L ~/local-lib/ Catalyst::Runtime
    cpanm -L ~/local-lib/ Mason

If you are having trouble installing cpanm, there may be an issue with your system's dependencies. 
Visit (​<https://library.linode.com/linux-tools/utilities/cpanm>) for help with installing dependencies.

In case local-lib is not in the path you have to add the following line in the .bashrc file (for a local-lib in your home)

`export PERL5LIB=/home/username/local-lib/lib/perl5:$PERL5LIB`

Do not forget to source .bashrc to be sure this changes make effect.


--------------------------------------------

2. Clone Github repository
--------------------------

Go to the CMV repository at GitHub (https://github.com/solgenomics/jscview) and copy the link to clone this repository.

Go to your terminal, to the folder where you want to clone this repository and use the next command (using the link copied from the web):

`git clone git@github.com:solgenomics/jscview.git`

or

`git clone https://github.com/solgenomics/jscview.git`

You can run the local server to check Catalyst is running fine, and in case you are running it on a server you should check also the Apache or Nginx configuration is right and the ports are open on the firewall.

Go to the folder jscview, created when cloned the repository and run the server to check if all the dependencies are installed.

    cd jscview/
    script/jscview_server -r -d --fork


If you got an error, you will probably will need to go back to step one and install some dependencies.


--------------------------------------------

3. Configuration file
---------------------
Once you have cloned the repository you will see a configuration file called jscview.conf inside the directory jscview. 
You will need to edit this file to customize all the paths, so they work on your system.

	name jscview

	dbhost https://brapihost
	host http://localhost


`dbhost` is the BraApi database url
`host` is the actual host url where CMV will be displayed


--------------------------------------------

4. BrAPI database
-----------------

CMV works using <a href="https://brapi.org/">BrAPI</a> structure for markers data. 



Check CMV solgenomics <a href="http://maps.solgenomics.net">here</a>
