#!/bin/bash
# Swap the domain everywhere it appears, in one go.
#
#   ./set-domain.sh yourdomain.com
#
# Updates canonical, og:url, og:image, JSON-LD, robots.txt, sitemap.xml,
# the enquiry-message header in main.js, and writes the CNAME file.

set -euo pipefail

if [ $# -ne 1 ]; then
    echo "usage: $0 yourdomain.com   (no https://, no trailing slash)" >&2
    exit 1
fi

NEW="${1#http://}"; NEW="${NEW#https://}"; NEW="${NEW%/}"
OLD="$( [ -f CNAME ] && cat CNAME || echo paharlaya.github.io/riacorpinternational )"

FILES=$(grep -rl "$OLD" . --include="*.html" --include="*.txt" --include="*.xml" --include="*.js" --include="*.webmanifest" 2>/dev/null || true)

if [ -n "$FILES" ]; then
    echo "$FILES" | while read -r f; do
        sed -i '' "s|$OLD|$NEW|g" "$f"
        echo "  updated $f"
    done
fi

printf '%s\n' "$NEW" > CNAME
echo "  wrote CNAME -> $NEW"

echo
echo "Done. Remaining manual steps:"
echo "  1. Point DNS at GitHub:"
echo "       A     @     185.199.108.153"
echo "       A     @     185.199.109.153"
echo "       A     @     185.199.110.153"
echo "       A     @     185.199.111.153"
echo "       CNAME www   paharlaya.github.io"
echo "  2. GitHub repo -> Settings -> Pages -> set the custom domain, tick Enforce HTTPS."
echo "  3. Drop the noindex line from tools/partials/head.html, set robots.txt to Allow: /,"
echo "     then re-run: node tools/build-pages.mjs"
