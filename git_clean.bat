@echo off
git remote prune origin
git gc --prune=now
