#!/bin/env zsh

pdfjam cards.pdf --quiet --papersize '{2.625in,3.625in}' --trim "0.25in 4.25in 8.125in 0.625in" --clip true --outfile cards1.pdf
pdfjam cards.pdf --quiet --papersize '{2.625in,3.625in}' --trim "2.875in 4.25in 5.5in 0.625in" --clip true --outfile cards2.pdf
pdfjam cards.pdf --quiet --papersize '{2.625in,3.625in}' --trim "5.5in 4.25in 2.875in 0.625in" --clip true --outfile cards3.pdf
pdfjam cards.pdf --quiet --papersize '{2.625in,3.625in}' --trim "8.125in 4.25in 0.25in 0.625in" --clip true --outfile cards4.pdf
pdfjam cards.pdf --quiet --papersize '{2.625in,3.625in}' --trim "0.25in 0.625in 8.125in 4.25in" --clip true --outfile cards5.pdf
pdfjam cards.pdf --quiet --papersize '{2.625in,3.625in}' --trim "2.875in 0.625in 5.5in 4.25in" --clip true --outfile cards6.pdf
pdfjam cards.pdf --quiet --papersize '{2.625in,3.625in}' --trim "5.5in 0.625in 2.875in 4.25in" --clip true --outfile cards7.pdf
pdfjam cards.pdf --quiet --papersize '{2.625in,3.625in}' --trim "8.125in 0.625in 0.25in 4.25in" --clip true --outfile cards8.pdf
 