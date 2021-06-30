#!/bin/bash
DEFAULT="http://localhost:1313"
TARGET=${1:-$DEFAULT}
wget --spider -r -nd -nv -H -l 1 $TARGET
