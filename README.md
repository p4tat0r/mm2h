# mm2h  
My Markdown 2 Html converter  
It's far from perfect, but that's a one that suits my needs.  
I used to work with Showdown|https://github.com/showdownjs/showdown but it does not behave like I expect such a lib to behave.  
  
NB : The links are not like markdown ones, I simplified the syntax, that's why they are "broken" in github markdown.  
  
I tried other libs from (this post from stack overflow)|https://stackoverflow.com/questions/1319657/javascript-to-convert-markdown-textile-to-html-and-ideally-back-to-markdown-t  
  
But none of them convinced me for what I wanted.  
  
I'm a lazy dev(, and I started from (this base)|https://github.com/HardfunStudios/dora_aws/blob/main/static/scripts/parse-md.js)   
Or some other similar repo, see that search : https://github.com/search?q=const+orderedListRegex+%3D+%2F%28%5Cn%5Cs*%28%5B0-9%5D%2B%5C.%29%5Cs.*%29%2B%2Fg%3B&type=code
  
# Some Examples  
You **don't need** to add 2 freaking non-sensical whitespaces at the end  
In order to jump to the next line.  
  
Some text with an emphasis on `this inline code`,   
  
I used highlight.js for syntax highlighting.    
You will have to clone the project to see the result.  
  
```python  
import os  
  
def main():  
	# This is python code with simple syntax, like stack overflow  
	print("This is a test")  
	raise TotoException  
  
```  
  
```  
This is just plaintext  
```  
  
```no  
This is text with no highlight  
  
```  
  
```naked  
This is a "naked" block :  
		The indentation works fine  
But the '-' (dashes) can't be used here to do yaml/markdown-like syntax  
You can, if you cant with a dirty trick used in 'codeBlockReplacer' for yaml, and then convert back it to "normal" in the last line of js in index.html  
  
```  
  
```yaml  
yaml_example:  
  - somekey :  
    "Some value"  
  - someotherkey:  
    "Some other value"  
    1234  
    987.654  
    true  
    "stuff"  
    "other stuff"  
  
```  
  
# Install  
  
Just copy the `index.html`,`highlight.min.js`, `mm2h.js` and `monokai.min.css` files somewhere  
  
# Usage  
  
  
- The markdown is written inside the div with `id="pure-markdown"`  
- If you need different config for code blocks, go have a look at https://github.com/highlightjs/highlight.js  
  
## Theming for code blocks  
  
If you don't like the theme for code, there are around 500 themes in highlightjs.   
You can try them out in this webpage : https://highlightjs.org/demo  
And when you find the one that suits you, just download it (or include the cdn) via this url :  
  
https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/{name-of-the-theme}.min.css  
  
And finally include it inside the `html_head` js like `monokai.min.js`  
  
# The Whats  
  
  
## What that lib IS  
 - A side project I did for me on a weekend.  
 - Something made in a quick and dirty way  
 - A source of inspiration, if someone wants the code, the idea, take it ! It's free.  
  
## What that lib is NOT  
 - A perfect implementation of markdown nor html.  
 - A space for discussion about markdown's RFC, discuss it on hn or whatever.  
  
## What is not working or badly working  
1. `HTML` syntax breaks everywhere because of conflicts within the html page and I can't repair it, I can live without it, can you ?  
2. `YAML` syntax because it conflicts with markdown with dashes `-`, so I had to make a hack with a temp replacement.  
3. The paragraphs are everywhere and it was a mess to find the right regex `paragraphRegex` to match `\n` but not those inside the following tags : div, code, pre,...  
4. Other little quirks here and there, but not that many  
  
## What I would like to do (because it's possible)  
1. Make proper markdown links (or a more friendly syntax)  
2. Improve CSS of code blocks  
3. Replace `p` tags with `br` and make them work properly  
  
## What I'm proud of  
 - Integration with `highlight.js`  
  
## What I won't do  
- Solving issues for bugs/improvements, it's a lib for me, I will commit when I feel like to  
  
# Highlight JS  
  
I used the version 11.9.0 or 11.10.0  
