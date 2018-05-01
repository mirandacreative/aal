#!/bin/bash
#
# Script to setup project
#
# Requirements:
# Have git command line installed
# Have sourcetree command line tools installed
# Have wordmove installed
# UPDATE YOUR MOVEFILE CREDENTIALS FIRST

command -v git >/dev/null 2>&1 || { echo >&2 "I require git but it's not installed.  Aborting."; exit 1;}
command -v wordmove >/dev/null 2>&1 || { echo >&2 "I require wordmove but it's not installed.  Aborting."; exit 1; }

echo "#################################################################"
echo "*** Create a new Destop Server Site with wordpress, Then..... ***"
echo "*** UPDATE YOUR MOVEFILE WITH YOUR LOCAL DATABASE CREDENTIALS ***"
echo "*** UPDATE THE VHOST AND WORDPRESS PATH BEFORE YOU CONTINUE   ***"
echo "#################################################################"
read -p "Continue? <y/n>: "
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "Aborting"
    exit 1
fi

echo
echo "##################################################################"
echo "Backing up important files"
echo "##################################################################"
cp -pv ./wp-config.php ./wp-config-TEMP.php.backup
cp -pv ./movefile.yml ./movefile.yml.backup
cp -pv ./wordmove_git_downloader.sh ./wordmove_git_downloader.sh.backup


read -p "Continue? <y/n>: "
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "Aborting"
    exit 1
fi


echo "Please paste here the clone url for the repo and press return: "
read git_repo_url

default_git_repo_branch='master'
read -e -p "Please enter here which branch you want to clone [$default_git_repo_branch]:" git_repo_branch
git_repo_branch=${git_repo_branch:-$default_git_repo_branch}

default_wordmove_environment='production'
read -e -p "Please enter here which wordmove environment you want to pull from [$default_wordmove_environment]:" wordmove_environment
wordmove_environment=${wordmove_environment:-$default_wordmove_environment}

echo
echo "You have entered:"
echo "git repo URL ("$git_repo_url")"
echo "git repo branch ("$git_repo_branch")"
echo "wordmove environment ("$wordmove_environment")"
echo
read -p "Continue? <y/n>: "
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "Aborting"
    exit 1
fi


cp -pv ./wp-config.php ./wp-config.php.backup
cp -pv ./movefile.yml ./Movefile-TEMP.php.backup
cp -pv ./wordmove_git_downloader.sh ./mcduplicate-TEMP.sh.backup


echo
echo "##################################################################"
echo "Clone repo into this folder and checkout the "$git_repo_branch" branch"
echo "##################################################################"
{
	rm -rf ${PWD}/tempfolder
	mkdir tempfolder
    git clone $git_repo_url ${PWD}/tempfolder
} || {
    echo "Aborting. Git tasks failed!"
    exit 1
}


echo
echo "##################################################################"
echo "Pull all files from develop environment"
echo "##################################################################"
wordmove pull -e $wordmove_environment -wuptd

echo "##################################################################"
echo "Moving Git cloned data to the root, overwriting the code pulled"
echo "down by wordmove."
echo "##################################################################"
cp  -rv ${PWD}/tempfolder/. ${PWD}/.
rm -rf ./tempfolder

echo "##################################################################"
echo "Got the files and database (we hope)"
echo "Do you want to create a new branch? "

read -p "Continue? <y/n>: "
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "Happy Coding!"
    echo "                      Miranda Creative Inc.                       "
    echo "                      Have a Creative Day!                        "
    exit 1
fi

echo "##################################################################"
echo "Type in a name for your branch using this format:"
echo "developer-project-taskname"
echo "##################################################################"
echo "Enter a branch name for your new branch OR CTRL C to exit"

read new_branch_name
git checkout -b $new_branch_name

echo
echo "##################################################################"
echo "Don't forget to gitignore this script and the .backup files."
echo "Happy coding!"
echo "##################################################################"

echo
echo "                       ********************                       "
echo "                    **************************                    "
echo "                  *****                   ******                  "
echo "                 ** **    ****     ******    ****                 "
echo "                 ****     *  **    *    *     * *                 "
echo "                 ***      *   *   **    *      **                 "
echo "                 ***     *    *****     *      **                 "
echo "                 ***     *  *   **      *      **                 "
echo "                 ***    *   ***    **   *      **                 "
echo "                 ***    ** *  *  ****   *      **                 "
echo "                 ****    ***  ****  *****     ***                 "
echo "                  ****                      ****                  "
echo "                   *****     ********     *****                   "
echo "                    *** ***            ******                     "
echo "                       ********************                       "
echo "                           ************                           "
echo "                                                                  "
echo "                      Miranda Creative Inc.                       "
echo "                      Have a Creative Day!                        "
