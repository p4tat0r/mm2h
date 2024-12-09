const replaceRegex = function(regex, replacement){
	return function(str){
		return str.replace(regex, replacement);
	}
}

// Regular expressions for Markdown
const codeBlockRegex = /(```([a-z0-9 ]*)?)([\s\S]*?)(```)/gm;
const inlineCodeRegex = /(`)(.*?)\1/g;
const imageRegex = /!\[([^\[]+)\]\(([^\)]+)\)/g;
const linkRegex = /(([A-Za-z0-9_-]*?)|(\([A-Za-z0-9 -]*?\)))?\|?(https?:[^()\[\]{}|\s]{4,})/g;
const headingRegex = /\n(#+\s*)(.*)/g;
const boldItalicsRegex = /(\*{1,2})(.*?)\1/g;
const strikethroughRegex = /(\~\~)(.*?)\1/g;
const blockquoteRegex = /\n(&gt;|\>)(.*)/g;
const horizontalRuleRegex = /\n((\-{3,})|(={3,}))/g;
const unorderedListRegex = /(\n\s*(\-|\+)\s.*)+/g;
const orderedListRegex = /(\n\s*([0-9]+\.)\s.*)+/g;

// Actually this regex and associated function paragraphReplacer don't work exactly as expected
// It replaces '\n' by '<p></p>' only outside of the blocks 'pre|code|ul|h|blockquote'
// And does not surround the desired text between inside <p> tags, so the html is a bit f'ed up
// But the resulting output is working as I would expect, so kinda works for me
// If anyone has a simple AND elegant solution, I'll consider it for sure
const paragraphRegex = /(\n)(?=((?!<\/(pre|code|div|ol|ul|h|blockquote)).)*?(<(pre|code|div|ol|ul|h|blockquote)|$))/gs;
// NB : If we replace '<p></p>' with '<br/>', there is too much space between lines

// Replacer functions for Markdown
const inlineCodeReplacer = function(fullMatch, tagStart, tagContents){
	return '<code style="background-color: #CCCCCC; padding: 2px 4px; border-radius: 3px;">' + tagContents + '</code>';
}
const imageReplacer = function(fullMatch, tagTitle, tagURL){
	return '<img src="' + tagURL + '" alt="' + tagTitle + '" />';
}
const linkReplacer = function(fullMatch, usefulMatch, tagTitle, tagTitleWithSpaces, tagURL) {
	if(!usefulMatch) usefulMatch = tagURL;
	if(usefulMatch.startsWith('(') && usefulMatch.endsWith(')')) usefulMatch = usefulMatch.substring(1, usefulMatch.length -1);
	return '<a href="' + tagURL + '" target="_blank">' + usefulMatch + '</a>';
}
const headingReplacer = function(fullMatch, tagStart, tagContents){
	return '\n<h' + tagStart.trim().length + '>' + tagContents + '</h' + tagStart.trim().length + '>';
}
const boldItalicsReplacer = function(fullMatch, tagStart, tagContents){
	return '<' + ( (tagStart.trim().length==1)?('em'):('strong') ) + '>'+ tagContents + '</' + ( (tagStart.trim().length==1)?('em'):('strong') ) + '>';
}
const strikethroughReplacer = function(fullMatch, tagStart, tagContents){
	return '<del>' + tagContents + '</del>';
}
const blockquoteReplacer = function(fullMatch, tagStart, tagContents){
	return '\n<blockquote>' + tagContents + '</blockquote>';
}
const horizontalRuleReplacer = function(fullMatch){
	return '\n<hr />';
}
const unorderedListReplacer = function(fullMatch){
	let items = '';
	fullMatch.trim().split('\n').forEach( item => {items += '<li>' + item.substring(2) + '</li>'; } );
	return '\n<ul>' + items + '</ul>';
}
const orderedListReplacer = function(fullMatch){
	let items = '';
	fullMatch.trim().split('\n').forEach( item => { items += '<li>' + item.substring(item.indexOf('.')+2) + '</li>'; } );
	return '\n<ol>' + items + '</ol>';
}
const paragraphReplacer = function(fullMatch, tagContents){
	// return '<br/>';
	// return '<br style=" content: ""; margin: 2em; display: block; font-size: 24%;">';
	return '<p>' + tagContents + '</p>';
}

const codeBlockReplacer = function(fullMatch, backquoteBegin, language, text, backquoteEnd) {
	switch(language){
	case 'naked':
		result = '<pre><code style="display: block;width: fit-content;background-color: #CCCCCC;padding: 10px;">'+text+'</code></pre>';
		break;
	case 'no':
		result = '<pre><div class="code nohighlight">'+text+'</div></pre>';
		break;
	case 'apache':
	case 'css':
	case 'dockerfile':
	case 'go':
	case 'ini':
	case 'java':
	case 'javascript':
	case 'json':
	case 'makefile':
	case 'php':
	case 'properties':
	case 'python':
	case 'shell':
	case 'sql':
	case 'xml':
		result = '<pre><div class="code language-' + language + '">'+text+'</div></pre>';
		break;
	case 'yaml': // Because f you yaml, conflicts with unordered lists, we'll replace it later on page load
		result = '<pre><div class="code language-' + language + '">'+text.replaceAll('-', '~')+'</div></pre>';
		break;
	default:
		result = '<pre><div class="code language-plaintext">'+text+'</div></pre>';
	}
	return result;
}
const replaceCodeBlocks = replaceRegex(codeBlockRegex, codeBlockReplacer)

// Rules for Markdown parsing (use in order of appearance for best results)
const replaceInlineCodes = replaceRegex(inlineCodeRegex, inlineCodeReplacer);
const replaceImages = replaceRegex(imageRegex, imageReplacer);
const replaceLinks = replaceRegex(linkRegex, linkReplacer);
const replaceHeadings = replaceRegex(headingRegex, headingReplacer);
const replaceBoldItalics = replaceRegex(boldItalicsRegex, boldItalicsReplacer);
const replaceceStrikethrough = replaceRegex(strikethroughRegex, strikethroughReplacer);
const replaceBlockquotes = replaceRegex(blockquoteRegex, blockquoteReplacer);
const replaceHorizontalRules = replaceRegex(horizontalRuleRegex, horizontalRuleReplacer);
const replaceUnorderedLists = replaceRegex(unorderedListRegex, unorderedListReplacer);
const replaceOrderedLists = replaceRegex(orderedListRegex, orderedListReplacer);
const replaceParagraphs = replaceRegex(paragraphRegex, paragraphReplacer);
// Fix for tab-indexed code blocks
const codeBlockFixRegex = /\n(<pre>)((\n|.)*)(<\/pre>)/g;
const codeBlockFixer = function(fullMatch, tagStart, tagContents, lastMatch, tagEnd){
	let lines = '';
	tagContents.split('\n').forEach( line => { lines += line.substring(1) + '\n'; } );
	return tagStart + lines + tagEnd;
}
const fixCodeBlocks = replaceRegex(codeBlockFixRegex, codeBlockFixer);


// Replacement rule order function for Markdown
// Do not use as-is, prefer parseMarkdown as seen below
const replaceMarkdown = function(str) {
  return replaceParagraphs(replaceOrderedLists(replaceUnorderedLists(
		replaceHorizontalRules(replaceBlockquotes(replaceceStrikethrough(
			replaceBoldItalics(replaceHeadings(replaceLinks(replaceImages(
				replaceInlineCodes(replaceCodeBlocks(str))
      ))))
    )))
	)));
		// For debug purposes
	  // return replaceOrderedLists(replaceUnorderedLists(
		// 	replaceHorizontalRules(replaceBlockquotes(replaceceStrikethrough(
		// 		replaceBoldItalics(replaceHeadings(replaceLinks(replaceImages(
		// 			replaceInlineCodes(replaceCodeBlocks(str))
	  //     ))))
	  //   )))
		// ));
}

// Parser for Markdown (fixes code, adds empty lines around for parsing)
// Usage: parseMarkdown(strVar)
const parseMarkdown = function(str) {
	return fixCodeBlocks(replaceMarkdown('\n' + str + '\n')).trim();
}
