#!/bin/env zsh

numpages="$(pdfinfo cards.pdf | grep Pages | awk '{print $2}')";
echo "Processing $numpages pages split across 8 files...\n"
for ((pos=1; pos<=8; pos++)); do
    printf "File $pos"
    for ((pg=4; pg<=numpages; pg+=2)); do
        pgindex=$((pg-1));
        pdftotext -f $pg -l $pg $(printf "cards%d.pdf" $pos) cardtext.txt;
        cardtitleraw=$(head -6 cardtext.txt | pcregrep -u "(?m)^(([A-Z])([A-Z'\`� -])+$)+");
        cardtitleraw=${(C)cardtitleraw};
        cardtitle="${cardtitleraw//$'\n'/ }";
        # cardtitle="${cardtitle#"Kindled "}";
        # cardtitle="${cardtitle#"Relic "}";
        # cardtitle="${cardtitle#"Artifact "}";
        cardtitle="${cardtitle#"The "}"
        cardtitle=`echo $cardtitle | sed -e "s/'//g"`
        magick -density 1200 $(printf "cards%d.pdf[%d]" $pos $pgindex ) $(printf "card_%03d_%d.jpg" $pg $pos);
        if [ -n "$cardtitle" ]; then
            mv "$(printf "card_%03d_%d.jpg" $pg $pos)" "$(printf "%s.jpg" $cardtitle)";
        fi
        printf ".";
    done
    printf "*\n";
done
