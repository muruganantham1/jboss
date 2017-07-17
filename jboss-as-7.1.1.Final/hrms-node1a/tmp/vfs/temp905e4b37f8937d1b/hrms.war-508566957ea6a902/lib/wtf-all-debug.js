/*
 * Copyright (C) 2012  Krawler Information Systems Pvt Ltd
 * All rights reserved.
 * 
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
*/

Wtf.DomHelper = function(){
    var tempTableEl = null;
    var emptyTags = /^(?:br|frame|hr|img|input|link|meta|range|spacer|wbr|area|param|col)$/i;
    var tableRe = /^table|tbody|tr|td$/i;
    
    
    
    var createHtml = function(o){
        if(typeof o == 'string'){
            return o;
        }
        var b = "";
        if(!o.tag){
            o.tag = "div";
        }
        b += "<" + o.tag;
        for(var attr in o){
            if(attr == "tag" || attr == "children" || attr == "cn" || attr == "html" || typeof o[attr] == "function") continue;
            if(attr == "style"){
                var s = o["style"];
                if(typeof s == "function"){
                    s = s.call();
                }
                if(typeof s == "string"){
                    b += ' style="' + s + '"';
                }else if(typeof s == "object"){
                    b += ' style="';
                    for(var key in s){
                        if(typeof s[key] != "function"){
                            b += key + ":" + s[key] + ";";
                        }
                    }
                    b += '"';
                }
            }else{
                if(attr == "cls"){
                    b += ' class="' + o["cls"] + '"';
                }else if(attr == "htmlFor"){
                    b += ' for="' + o["htmlFor"] + '"';
                }else{
                    b += " " + attr + '="' + o[attr] + '"';
                }
            }
        }
        if(emptyTags.test(o.tag)){
            b += "/>";
        }else{
            b += ">";
            var cn = o.children || o.cn;
            if(cn){
                if(cn instanceof Array){
                    for(var i = 0, len = cn.length; i < len; i++) {
                        b += createHtml(cn[i], b);
                    }
                }else{
                    b += createHtml(cn, b);
                }
            }
            if(o.html){
                b += o.html;
            }
            b += "</" + o.tag + ">";
        }
        return b;
    };

    
    
    var createDom = function(o, parentNode){
        var el = document.createElement(o.tag||'div');
        var useSet = el.setAttribute ? true : false; 
        for(var attr in o){
            if(attr == "tag" || attr == "children" || attr == "cn" || attr == "html" || attr == "style" || typeof o[attr] == "function") continue;
            if(attr=="cls"){
                el.className = o["cls"];
            }else{
                if(useSet) el.setAttribute(attr, o[attr]);
                else el[attr] = o[attr];
            }
        }
        Wtf.DomHelper.applyStyles(el, o.style);
        var cn = o.children || o.cn;
        if(cn){
            if(cn instanceof Array){
                for(var i = 0, len = cn.length; i < len; i++) {
                    createDom(cn[i], el);
                }
            }else{
                createDom(cn, el);
            }
        }
        if(o.html){
            el.innerHTML = o.html;
        }
        if(parentNode){
           parentNode.appendChild(el);
        }
        return el;
    };

    var ieTable = function(depth, s, h, e){
        tempTableEl.innerHTML = [s, h, e].join('');
        var i = -1, el = tempTableEl;
        while(++i < depth){
            el = el.firstChild;
        }
        return el;
    };

    
    var ts = '<table>',
        te = '</table>',
        tbs = ts+'<tbody>',
        tbe = '</tbody>'+te,
        trs = tbs + '<tr>',
        tre = '</tr>'+tbe;

    
    var insertIntoTable = function(tag, where, el, html){
        if(!tempTableEl){
            tempTableEl = document.createElement('div');
        }
        var node;
        var before = null;
        if(tag == 'td'){
            if(where == 'afterbegin' || where == 'beforeend'){ 
                return;
            }
            if(where == 'beforebegin'){
                before = el;
                el = el.parentNode;
            } else{
                before = el.nextSibling;
                el = el.parentNode;
            }
            node = ieTable(4, trs, html, tre);
        }
        else if(tag == 'tr'){
            if(where == 'beforebegin'){
                before = el;
                el = el.parentNode;
                node = ieTable(3, tbs, html, tbe);
            } else if(where == 'afterend'){
                before = el.nextSibling;
                el = el.parentNode;
                node = ieTable(3, tbs, html, tbe);
            } else{ 
                if(where == 'afterbegin'){
                    before = el.firstChild;
                }
                node = ieTable(4, trs, html, tre);
            }
        } else if(tag == 'tbody'){
            if(where == 'beforebegin'){
                before = el;
                el = el.parentNode;
                node = ieTable(2, ts, html, te);
            } else if(where == 'afterend'){
                before = el.nextSibling;
                el = el.parentNode;
                node = ieTable(2, ts, html, te);
            } else{
                if(where == 'afterbegin'){
                    before = el.firstChild;
                }
                node = ieTable(3, tbs, html, tbe);
            }
        } else{ 
            if(where == 'beforebegin' || where == 'afterend'){ 
                return;
            }
            if(where == 'afterbegin'){
                before = el.firstChild;
            }
            node = ieTable(2, ts, html, te);
        }
        el.insertBefore(node, before);
        return node;
    };


    return {
    
    useDom : false,

    
    markup : function(o){
        return createHtml(o);
    },

    
    applyStyles : function(el, styles){
        if(styles){
           el = Wtf.fly(el);
           if(typeof styles == "string"){
               var re = /\s?([a-z\-]*)\:\s?([^;]*);?/gi;
               var matches;
               while ((matches = re.exec(styles)) != null){
                   el.setStyle(matches[1], matches[2]);
               }
           }else if (typeof styles == "object"){
               for (var style in styles){
                  el.setStyle(style, styles[style]);
               }
           }else if (typeof styles == "function"){
                Wtf.DomHelper.applyStyles(el, styles.call());
           }
        }
    },

    
    insertHtml : function(where, el, html){
        where = where.toLowerCase();
        if(el.insertAdjacentHTML){
            if(tableRe.test(el.tagName)){
                var rs;
                if(rs = insertIntoTable(el.tagName.toLowerCase(), where, el, html)){
                    return rs;
                }
            }
            switch(where){
                case "beforebegin":
                    el.insertAdjacentHTML('BeforeBegin', html);
                    return el.previousSibling;
                case "afterbegin":
                    el.insertAdjacentHTML('AfterBegin', html);
                    return el.firstChild;
                case "beforeend":
                    el.insertAdjacentHTML('BeforeEnd', html);
                    return el.lastChild;
                case "afterend":
                    el.insertAdjacentHTML('AfterEnd', html);
                    return el.nextSibling;
            }
            throw 'Illegal insertion point -> "' + where + '"';
        }
        var range = el.ownerDocument.createRange();
        var frag;
        switch(where){
             case "beforebegin":
                range.setStartBefore(el);
                frag = range.createContextualFragment(html);
                el.parentNode.insertBefore(frag, el);
                return el.previousSibling;
             case "afterbegin":
                if(el.firstChild){
                    range.setStartBefore(el.firstChild);
                    frag = range.createContextualFragment(html);
                    el.insertBefore(frag, el.firstChild);
                    return el.firstChild;
                }else{
                    el.innerHTML = html;
                    return el.firstChild;
                }
            case "beforeend":
                if(el.lastChild){
                    range.setStartAfter(el.lastChild);
                    frag = range.createContextualFragment(html);
                    el.appendChild(frag);
                    return el.lastChild;
                }else{
                    el.innerHTML = html;
                    return el.lastChild;
                }
            case "afterend":
                range.setStartAfter(el);
                frag = range.createContextualFragment(html);
                el.parentNode.insertBefore(frag, el.nextSibling);
                return el.nextSibling;
            }
            throw 'Illegal insertion point -> "' + where + '"';
    },

    
    insertBefore : function(el, o, returnElement){
        return this.doInsert(el, o, returnElement, "beforeBegin");
    },

    
    insertAfter : function(el, o, returnElement){
        return this.doInsert(el, o, returnElement, "afterEnd", "nextSibling");
    },

    
    insertFirst : function(el, o, returnElement){
        return this.doInsert(el, o, returnElement, "afterBegin", "firstChild");
    },

    
    doInsert : function(el, o, returnElement, pos, sibling){
        el = Wtf.getDom(el);
        var newNode;
        if(this.useDom){
            newNode = createDom(o, null);
            (sibling === "firstChild" ? el : el.parentNode).insertBefore(newNode, sibling ? el[sibling] : el);
        }else{
            var html = createHtml(o);
            newNode = this.insertHtml(pos, el, html);
        }
        return returnElement ? Wtf.get(newNode, true) : newNode;
    },

    
    append : function(el, o, returnElement){
        el = Wtf.getDom(el);
        var newNode;
        if(this.useDom){
            newNode = createDom(o, null);
            el.appendChild(newNode);
        }else{
            var html = createHtml(o);
            newNode = this.insertHtml("beforeEnd", el, html);
        }
        return returnElement ? Wtf.get(newNode, true) : newNode;
    },

    
    overwrite : function(el, o, returnElement){
        el = Wtf.getDom(el);
        el.innerHTML = createHtml(o);
        return returnElement ? Wtf.get(el.firstChild, true) : el.firstChild;
    },

    
    createTemplate : function(o){
        var html = createHtml(o);
        return new Wtf.Template(html);
    }
    };
}();


Wtf.Template = function(html){
    var a = arguments;
    if(html instanceof Array){
        html = html.join("");
    }else if(a.length > 1){
        var buf = [];
        for(var i = 0, len = a.length; i < len; i++){
            if(typeof a[i] == 'object'){
                Wtf.apply(this, a[i]);
            }else{
                buf[buf.length] = a[i];
            }
        }
        html = buf.join('');
    }
    
    this.html = html;
    if(this.compiled){
        this.compile();   
    }
};
Wtf.Template.prototype = {
    
    applyTemplate : function(values){
        if(this.compiled){
            return this.compiled(values);
        }
        var useF = this.disableFormats !== true;
        var fm = Wtf.util.Format, tpl = this;
        var fn = function(m, name, format, args){
            if(format && useF){
                if(format.substr(0, 5) == "this."){
                    return tpl.call(format.substr(5), values[name], values);
                }else{
                    if(args){
                        
                        
                        
                        var re = /^\s*['"](.*)["']\s*$/;
                        args = args.split(',');
                        for(var i = 0, len = args.length; i < len; i++){
                            args[i] = args[i].replace(re, "$1");
                        }
                        args = [values[name]].concat(args);
                    }else{
                        args = [values[name]];
                    }
                    return fm[format].apply(fm, args);
                }
            }else{
                return values[name] !== undefined ? values[name] : "";
            }
        };
        return this.html.replace(this.re, fn);
    },
    
    
    set : function(html, compile){
        this.html = html;
        this.compiled = null;
        if(compile){
            this.compile();
        }
        return this;
    },
    
    
    disableFormats : false,
    
    
    re : /\{([\w-]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?\}/g,
    
    
    compile : function(){
        var fm = Wtf.util.Format;
        var useF = this.disableFormats !== true;
        var sep = Wtf.isGecko ? "+" : ",";
        var fn = function(m, name, format, args){
            if(format && useF){
                args = args ? ',' + args : "";
                if(format.substr(0, 5) != "this."){
                    format = "fm." + format + '(';
                }else{
                    format = 'this.call("'+ format.substr(5) + '", ';
                    args = ", values";
                }
            }else{
                args= ''; format = "(values['" + name + "'] == undefined ? '' : ";
            }
            return "'"+ sep + format + "values['" + name + "']" + args + ")"+sep+"'";
        };
        var body;
        
        if(Wtf.isGecko){
            body = "this.compiled = function(values){ return '" +
                   this.html.replace(/\\/g, '\\\\').replace(/(\r\n|\n)/g, '\\n').replace(/'/g, "\\'").replace(this.re, fn) +
                    "';};";
        }else{
            body = ["this.compiled = function(values){ return ['"];
            body.push(this.html.replace(/\\/g, '\\\\').replace(/(\r\n|\n)/g, '\\n').replace(/'/g, "\\'").replace(this.re, fn));
            body.push("'].join('');};");
            body = body.join('');
        }
        eval(body);
        return this;
    },
    
    
    call : function(fnName, value, allValues){
        return this[fnName](value, allValues);
    },
    
    
    insertFirst: function(el, values, returnElement){
        return this.doInsert('afterBegin', el, values, returnElement);
    },

    
    insertBefore: function(el, values, returnElement){
        return this.doInsert('beforeBegin', el, values, returnElement);
    },

    
    insertAfter : function(el, values, returnElement){
        return this.doInsert('afterEnd', el, values, returnElement);
    },
    
    
    append : function(el, values, returnElement){
        return this.doInsert('beforeEnd', el, values, returnElement);
    },

    doInsert : function(where, el, values, returnEl){
        el = Wtf.getDom(el);
        var newNode = Wtf.DomHelper.insertHtml(where, el, this.applyTemplate(values));
        return returnEl ? Wtf.get(newNode, true) : newNode;
    },

    
    overwrite : function(el, values, returnElement){
        el = Wtf.getDom(el);
        el.innerHTML = this.applyTemplate(values);
        return returnElement ? Wtf.get(el.firstChild, true) : el.firstChild;
    }
};

Wtf.Template.prototype.apply = Wtf.Template.prototype.applyTemplate;


Wtf.DomHelper.Template = Wtf.Template;


Wtf.Template.from = function(el, config){
    el = Wtf.getDom(el);
    return new Wtf.Template(el.value || el.innerHTML, config || '');
};


Wtf.DomQuery = function(){
    var cache = {}, simpleCache = {}, valueCache = {};
    var nonSpace = /\S/;
    var trimRe = /^\s+|\s+$/g;
    var tplRe = /\{(\d+)\}/g;
    var modeRe = /^(\s?[\/>+~]\s?|\s|$)/;
    var tagTokenRe = /^(#)?([\w-\*]+)/;
    var nthRe = /(\d*)n\+?(\d*)/, nthRe2 = /\D/;

    function child(p, index){
        var i = 0;
        var n = p.firstChild;
        while(n){
            if(n.nodeType == 1){
               if(++i == index){
                   return n;
               }
            }
            n = n.nextSibling;
        }
        return null;
    };

    function next(n){
        while((n = n.nextSibling) && n.nodeType != 1);
        return n;
    };

    function prev(n){
        while((n = n.previousSibling) && n.nodeType != 1);
        return n;
    };

    function children(d){
        var n = d.firstChild, ni = -1;
 	    while(n){
 	        var nx = n.nextSibling;
 	        if(n.nodeType == 3 && !nonSpace.test(n.nodeValue)){
 	            d.removeChild(n);
 	        }else{
 	            n.nodeIndex = ++ni;
 	        }
 	        n = nx;
 	    }
 	    return this;
 	};

    function byClassName(c, a, v){
        if(!v){
            return c;
        }
        var r = [], ri = -1, cn;
        for(var i = 0, ci; ci = c[i]; i++){
            if((' '+ci.className+' ').indexOf(v) != -1){
                r[++ri] = ci;
            }
        }
        return r;
    };

    function attrValue(n, attr){
        if(!n.tagName && typeof n.length != "undefined"){
            n = n[0];
        }
        if(!n){
            return null;
        }
        if(attr == "for"){
            return n.htmlFor;
        }
        if(attr == "class" || attr == "className"){
            return n.className;
        }
        return n.getAttribute(attr) || n[attr];

    };

    function getNodes(ns, mode, tagName){
        var result = [], ri = -1, cs;
        if(!ns){
            return result;
        }
        tagName = tagName || "*";
        if(typeof ns.getElementsByTagName != "undefined"){
            ns = [ns];
        }
        if(!mode){
            for(var i = 0, ni; ni = ns[i]; i++){
                cs = ni.getElementsByTagName(tagName);
                for(var j = 0, ci; ci = cs[j]; j++){
                    result[++ri] = ci;
                }
            }
        }else if(mode == "/" || mode == ">"){
            var utag = tagName.toUpperCase();
            for(var i = 0, ni, cn; ni = ns[i]; i++){
                cn = ni.children || ni.childNodes;
                for(var j = 0, cj; cj = cn[j]; j++){
                    if(cj.nodeName == utag || cj.nodeName == tagName  || tagName == '*'){
                        result[++ri] = cj;
                    }
                }
            }
        }else if(mode == "+"){
            var utag = tagName.toUpperCase();
            for(var i = 0, n; n = ns[i]; i++){
                while((n = n.nextSibling) && n.nodeType != 1);
                if(n && (n.nodeName == utag || n.nodeName == tagName || tagName == '*')){
                    result[++ri] = n;
                }
            }
        }else if(mode == "~"){
            for(var i = 0, n; n = ns[i]; i++){
                while((n = n.nextSibling) && (n.nodeType != 1 || (tagName == '*' || n.tagName.toLowerCase()!=tagName)));
                if(n){
                    result[++ri] = n;
                }
            }
        }
        return result;
    };

    function concat(a, b){
        if(b.slice){
            return a.concat(b);
        }
        for(var i = 0, l = b.length; i < l; i++){
            a[a.length] = b[i];
        }
        return a;
    }

    function byTag(cs, tagName){
        if(cs.tagName || cs == document){
            cs = [cs];
        }
        if(!tagName){
            return cs;
        }
        var r = [], ri = -1;
        tagName = tagName.toLowerCase();
        for(var i = 0, ci; ci = cs[i]; i++){
            if(ci.nodeType == 1 && ci.tagName.toLowerCase()==tagName){
                r[++ri] = ci;
            }
        }
        return r;
    };

    function byId(cs, attr, id){
        if(cs.tagName || cs == document){
            cs = [cs];
        }
        if(!id){
            return cs;
        }
        var r = [], ri = -1;
        for(var i = 0,ci; ci = cs[i]; i++){
            if(ci && ci.id == id){
                r[++ri] = ci;
                return r;
            }
        }
        return r;
    };

    function byAttribute(cs, attr, value, op, custom){
        var r = [], ri = -1, st = custom=="{";
        var f = Wtf.DomQuery.operators[op];
        for(var i = 0, ci; ci = cs[i]; i++){
            var a;
            if(st){
                a = Wtf.DomQuery.getStyle(ci, attr);
            }
            else if(attr == "class" || attr == "className"){
                a = ci.className;
            }else if(attr == "for"){
                a = ci.htmlFor;
            }else if(attr == "href"){
                a = ci.getAttribute("href", 2);
            }else{
                a = ci.getAttribute(attr);
            }
            if((f && f(a, value)) || (!f && a)){
                r[++ri] = ci;
            }
        }
        return r;
    };

    function byPseudo(cs, name, value){
        return Wtf.DomQuery.pseudos[name](cs, value);
    };

    
    
    
    var isIE = window.ActiveXObject ? true : false;

    
    
    eval("var batch = 30803;");

    var key = 30803;

    function nodupIEXml(cs){
        var d = ++key;
        cs[0].setAttribute("_nodup", d);
        var r = [cs[0]];
        for(var i = 1, len = cs.length; i < len; i++){
            var c = cs[i];
            if(!c.getAttribute("_nodup") != d){
                c.setAttribute("_nodup", d);
                r[r.length] = c;
            }
        }
        for(var i = 0, len = cs.length; i < len; i++){
            cs[i].removeAttribute("_nodup");
        }
        return r;
    }

    function nodup(cs){
        if(!cs){
            return [];
        }
        var len = cs.length, c, i, r = cs, cj, ri = -1;
        if(!len || typeof cs.nodeType != "undefined" || len == 1){
            return cs;
        }
        if(isIE && typeof cs[0].selectSingleNode != "undefined"){
            return nodupIEXml(cs);
        }
        var d = ++key;
        cs[0]._nodup = d;
        for(i = 1; c = cs[i]; i++){
            if(c._nodup != d){
                c._nodup = d;
            }else{
                r = [];
                for(var j = 0; j < i; j++){
                    r[++ri] = cs[j];
                }
                for(j = i+1; cj = cs[j]; j++){
                    if(cj._nodup != d){
                        cj._nodup = d;
                        r[++ri] = cj;
                    }
                }
                return r;
            }
        }
        return r;
    }

    function quickDiffIEXml(c1, c2){
        var d = ++key;
        for(var i = 0, len = c1.length; i < len; i++){
            c1[i].setAttribute("_qdiff", d);
        }
        var r = [];
        for(var i = 0, len = c2.length; i < len; i++){
            if(c2[i].getAttribute("_qdiff") != d){
                r[r.length] = c2[i];
            }
        }
        for(var i = 0, len = c1.length; i < len; i++){
           c1[i].removeAttribute("_qdiff");
        }
        return r;
    }

    function quickDiff(c1, c2){
        var len1 = c1.length;
        if(!len1){
            return c2;
        }
        if(isIE && c1[0].selectSingleNode){
            return quickDiffIEXml(c1, c2);
        }
        var d = ++key;
        for(var i = 0; i < len1; i++){
            c1[i]._qdiff = d;
        }
        var r = [];
        for(var i = 0, len = c2.length; i < len; i++){
            if(c2[i]._qdiff != d){
                r[r.length] = c2[i];
            }
        }
        return r;
    }

    function quickId(ns, mode, root, id){
        if(ns == root){
           var d = root.ownerDocument || root;
           return d.getElementById(id);
        }
        ns = getNodes(ns, mode, "*");
        return byId(ns, null, id);
    }

    return {
        getStyle : function(el, name){
            return Wtf.fly(el).getStyle(name);
        },
        
        compile : function(path, type){
            type = type || "select";

            var fn = ["var f = function(root){\n var mode; ++batch; var n = root || document;\n"];
            var q = path, mode, lq;
            var tk = Wtf.DomQuery.matchers;
            var tklen = tk.length;
            var mm;

            
            var lmode = q.match(modeRe);
            if(lmode && lmode[1]){
                fn[fn.length] = 'mode="'+lmode[1].replace(trimRe, "")+'";';
                q = q.replace(lmode[1], "");
            }
            
            while(path.substr(0, 1)=="/"){
                path = path.substr(1);
            }

            while(q && lq != q){
                lq = q;
                var tm = q.match(tagTokenRe);
                if(type == "select"){
                    if(tm){
                        if(tm[1] == "#"){
                            fn[fn.length] = 'n = quickId(n, mode, root, "'+tm[2]+'");';
                        }else{
                            fn[fn.length] = 'n = getNodes(n, mode, "'+tm[2]+'");';
                        }
                        q = q.replace(tm[0], "");
                    }else if(q.substr(0, 1) != '@'){
                        fn[fn.length] = 'n = getNodes(n, mode, "*");';
                    }
                }else{
                    if(tm){
                        if(tm[1] == "#"){
                            fn[fn.length] = 'n = byId(n, null, "'+tm[2]+'");';
                        }else{
                            fn[fn.length] = 'n = byTag(n, "'+tm[2]+'");';
                        }
                        q = q.replace(tm[0], "");
                    }
                }
                while(!(mm = q.match(modeRe))){
                    var matched = false;
                    for(var j = 0; j < tklen; j++){
                        var t = tk[j];
                        var m = q.match(t.re);
                        if(m){
                            fn[fn.length] = t.select.replace(tplRe, function(x, i){
                                                    return m[i];
                                                });
                            q = q.replace(m[0], "");
                            matched = true;
                            break;
                        }
                    }
                    
                    if(!matched){
                        throw 'Error parsing selector, parsing failed at "' + q + '"';
                    }
                }
                if(mm[1]){
                    fn[fn.length] = 'mode="'+mm[1].replace(trimRe, "")+'";';
                    q = q.replace(mm[1], "");
                }
            }
            fn[fn.length] = "return nodup(n);\n}";
            eval(fn.join(""));
            return f;
        },

        
        select : function(path, root, type){
            if(!root || root == document){
                root = document;
            }
            if(typeof root == "string"){
                root = document.getElementById(root);
            }
            var paths = path.split(",");
            var results = [];
            for(var i = 0, len = paths.length; i < len; i++){
                var p = paths[i].replace(trimRe, "");
                if(!cache[p]){
                    cache[p] = Wtf.DomQuery.compile(p);
                    if(!cache[p]){
                        throw p + " is not a valid selector";
                    }
                }
                var result = cache[p](root);
                if(result && result != document){
                    results = results.concat(result);
                }
            }
            if(paths.length > 1){
                return nodup(results);
            }
            return results;
        },

        
        selectNode : function(path, root){
            return Wtf.DomQuery.select(path, root)[0];
        },

        
        selectValue : function(path, root, defaultValue){
            path = path.replace(trimRe, "");
            if(!valueCache[path]){
                valueCache[path] = Wtf.DomQuery.compile(path, "select");
            }
            var n = valueCache[path](root);
            n = n[0] ? n[0] : n;
            var v = (n && n.firstChild ? n.firstChild.nodeValue : null);
            return ((v === null||v === undefined||v==='') ? defaultValue : v);
        },

        
        selectNumber : function(path, root, defaultValue){
            var v = Wtf.DomQuery.selectValue(path, root, defaultValue || 0);
            return parseFloat(v);
        },

        
        is : function(el, ss){
            if(typeof el == "string"){
                el = document.getElementById(el);
            }
            var isArray = (el instanceof Array);
            var result = Wtf.DomQuery.filter(isArray ? el : [el], ss);
            return isArray ? (result.length == el.length) : (result.length > 0);
        },

        
        filter : function(els, ss, nonMatches){
            ss = ss.replace(trimRe, "");
            if(!simpleCache[ss]){
                simpleCache[ss] = Wtf.DomQuery.compile(ss, "simple");
            }
            var result = simpleCache[ss](els);
            return nonMatches ? quickDiff(result, els) : result;
        },

        
        matchers : [{
                re: /^\.([\w-]+)/,
                select: 'n = byClassName(n, null, " {1} ");'
            }, {
                re: /^\:([\w-]+)(?:\(((?:[^\s>\/]*|.*?))\))?/,
                select: 'n = byPseudo(n, "{1}", "{2}");'
            },{
                re: /^(?:([\[\{])(?:@)?([\w-]+)\s?(?:(=|.=)\s?['"]?(.*?)["']?)?[\]\}])/,
                select: 'n = byAttribute(n, "{2}", "{4}", "{3}", "{1}");'
            }, {
                re: /^#([\w-]+)/,
                select: 'n = byId(n, null, "{1}");'
            },{
                re: /^@([\w-]+)/,
                select: 'return {firstChild:{nodeValue:attrValue(n, "{1}")}};'
            }
        ],

        
        operators : {
            "=" : function(a, v){
                return a == v;
            },
            "!=" : function(a, v){
                return a != v;
            },
            "^=" : function(a, v){
                return a && a.substr(0, v.length) == v;
            },
            "$=" : function(a, v){
                return a && a.substr(a.length-v.length) == v;
            },
            "*=" : function(a, v){
                return a && a.indexOf(v) !== -1;
            },
            "%=" : function(a, v){
                return (a % v) == 0;
            },
            "|=" : function(a, v){
                return a && (a == v || a.substr(0, v.length+1) == v+'-');
            },
            "~=" : function(a, v){
                return a && (' '+a+' ').indexOf(' '+v+' ') != -1;
            }
        },

        
        pseudos : {
            "first-child" : function(c){
                var r = [], ri = -1, n;
                for(var i = 0, ci; ci = n = c[i]; i++){
                    while((n = n.previousSibling) && n.nodeType != 1);
                    if(!n){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "last-child" : function(c){
                var r = [], ri = -1, n;
                for(var i = 0, ci; ci = n = c[i]; i++){
                    while((n = n.nextSibling) && n.nodeType != 1);
                    if(!n){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "nth-child" : function(c, a) {
                var r = [], ri = -1;
                var m = nthRe.exec(a == "even" && "2n" || a == "odd" && "2n+1" || !nthRe2.test(a) && "n+" + a || a);
                var f = (m[1] || 1) - 0, l = m[2] - 0;
                for(var i = 0, n; n = c[i]; i++){
                    var pn = n.parentNode;
                    if (batch != pn._batch) {
                        var j = 0;
                        for(var cn = pn.firstChild; cn; cn = cn.nextSibling){
                            if(cn.nodeType == 1){
                               cn.nodeIndex = ++j;
                            }
                        }
                        pn._batch = batch;
                    }
                    if (f == 1) {
                        if (l == 0 || n.nodeIndex == l){
                            r[++ri] = n;
                        }
                    } else if ((n.nodeIndex + l) % f == 0){
                        r[++ri] = n;
                    }
                }

                return r;
            },

            "only-child" : function(c){
                var r = [], ri = -1;;
                for(var i = 0, ci; ci = c[i]; i++){
                    if(!prev(ci) && !next(ci)){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "empty" : function(c){
                var r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    var cns = ci.childNodes, j = 0, cn, empty = true;
                    while(cn = cns[j]){
                        ++j;
                        if(cn.nodeType == 1 || cn.nodeType == 3){
                            empty = false;
                            break;
                        }
                    }
                    if(empty){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "contains" : function(c, v){
                var r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    if((ci.textContent||ci.innerText||'').indexOf(v) != -1){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "nodeValue" : function(c, v){
                var r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    if(ci.firstChild && ci.firstChild.nodeValue == v){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "checked" : function(c){
                var r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    if(ci.checked == true){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "not" : function(c, ss){
                return Wtf.DomQuery.filter(c, ss, true);
            },

            "any" : function(c, selectors){
                var ss = selectors.split('|');
                var r = [], ri = -1, s;
                for(var i = 0, ci; ci = c[i]; i++){
                    for(var j = 0; s = ss[j]; j++){
                        if(Wtf.DomQuery.is(ci, s)){
                            r[++ri] = ci;
                            break;
                        }
                    }
                }
                return r;
            },

            "odd" : function(c){
                return this["nth-child"](c, "odd");
            },

            "even" : function(c){
                return this["nth-child"](c, "even");
            },

            "nth" : function(c, a){
                return c[a-1] || [];
            },

            "first" : function(c){
                return c[0] || [];
            },

            "last" : function(c){
                return c[c.length-1] || [];
            },

            "has" : function(c, ss){
                var s = Wtf.DomQuery.select;
                var r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    if(s(ss, ci).length > 0){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "next" : function(c, ss){
                var is = Wtf.DomQuery.is;
                var r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    var n = next(ci);
                    if(n && is(n, ss)){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "prev" : function(c, ss){
                var is = Wtf.DomQuery.is;
                var r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    var n = prev(ci);
                    if(n && is(n, ss)){
                        r[++ri] = ci;
                    }
                }
                return r;
            }
        }
    };
}();


Wtf.query = Wtf.DomQuery.select;


Wtf.util.Observable = function(){
    
    if(this.listeners){
        this.on(this.listeners);
        delete this.listeners;
    }
};
Wtf.util.Observable.prototype = {
    
    fireEvent : function(){
        if(this.eventsSuspended !== true){
            var ce = this.events[arguments[0].toLowerCase()];
            if(typeof ce == "object"){
                return ce.fire.apply(ce, Array.prototype.slice.call(arguments, 1));
            }
        }
        return true;
    },

        filterOptRe : /^(?:scope|delay|buffer|single)$/,

    
    addListener : function(eventName, fn, scope, o){
        if(typeof eventName == "object"){
            o = eventName;
            for(var e in o){
                if(this.filterOptRe.test(e)){
                    continue;
                }
                if(typeof o[e] == "function"){
                                        this.addListener(e, o[e], o.scope,  o);
                }else{
                                        this.addListener(e, o[e].fn, o[e].scope, o[e]);
                }
            }
            return;
        }
        o = (!o || typeof o == "boolean") ? {} : o;
        eventName = eventName.toLowerCase();
        var ce = this.events[eventName] || true;
        if(typeof ce == "boolean"){
            ce = new Wtf.util.Event(this, eventName);
            this.events[eventName] = ce;
        }
        ce.addListener(fn, scope, o);
    },

    
    removeListener : function(eventName, fn, scope){
        var ce = this.events[eventName.toLowerCase()];
        if(typeof ce == "object"){
            ce.removeListener(fn, scope);
        }
    },

    
    purgeListeners : function(){
        for(var evt in this.events){
            if(typeof this.events[evt] == "object"){
                 this.events[evt].clearListeners();
            }
        }
    },

    relayEvents : function(o, events){
        var createHandler = function(ename){
            return function(){
                return this.fireEvent.apply(this, Wtf.combine(ename, Array.prototype.slice.call(arguments, 0)));
            };
        };
        for(var i = 0, len = events.length; i < len; i++){
            var ename = events[i];
            if(!this.events[ename]){ this.events[ename] = true; };
            o.on(ename, createHandler(ename), this);
        }
    },

    
    addEvents : function(o){
        if(!this.events){
            this.events = {};
        }
        if(typeof o == 'string'){
            for(var i = 0, a = arguments, v; v = a[i]; i++){
                if(!this.events[a[i]]){
                    o[a[i]] = true;
                }
            }
        }else{
            Wtf.applyIf(this.events, o);
        }
    },

    
    hasListener : function(eventName){
        var e = this.events[eventName];
        return typeof e == "object" && e.listeners.length > 0;
    },

    
    suspendEvents : function(){
        this.eventsSuspended = true;
    },

    
    resumeEvents : function(){
        this.eventsSuspended = false;
    },

                getMethodEvent : function(method){
        if(!this.methodEvents){
            this.methodEvents = {};
        }
        var e = this.methodEvents[method];
        if(!e){
            e = {};
            this.methodEvents[method] = e;

            e.originalFn = this[method];
            e.methodName = method;
            e.before = [];
            e.after = [];


            var returnValue, v, cancel;
            var obj = this;

            var makeCall = function(fn, scope, args){
                if((v = fn.apply(scope || obj, args)) !== undefined){
                    if(typeof v === 'object'){
                        if(v.returnValue !== undefined){
                            returnValue = v.returnValue;
                        }else{
                            returnValue = v;
                        }
                        if(v.cancel === true){
                            cancel = true;
                        }
                    }else if(v === false){
                        cancel = true;
                    }else {
                        returnValue = v;
                    }
                }
            }

            this[method] = function(){
                returnValue = v = undefined; cancel = false;
                var args = Array.prototype.slice.call(arguments, 0);
                for(var i = 0, len = e.before.length; i < len; i++){
                    makeCall(e.before[i].fn, e.before[i].scope, args);
                    if(cancel){
                        return returnValue;
                    }
                }

                if((v = e.originalFn.apply(obj, args)) !== undefined){
                    returnValue = v;
                }

                for(var i = 0, len = e.after.length; i < len; i++){
                    makeCall(e.after[i].fn, e.after[i].scope, args);
                    if(cancel){
                        return returnValue;
                    }
                }
                return returnValue;
            };
        }
        return e;
    },

        beforeMethod : function(method, fn, scope){
        var e = this.getMethodEvent(method);
        e.before.push({fn: fn, scope: scope});
    },

        afterMethod : function(method, fn, scope){
        var e = this.getMethodEvent(method);
        e.after.push({fn: fn, scope: scope});
    },

    removeMethodListener : function(method, fn, scope){
        var e = this.getMethodEvent(method);
        for(var i = 0, len = e.before.length; i < len; i++){
            if(e.before[i].fn == fn && e.before[i].scope == scope){
                e.before.splice(i, 1);
                return;
            }
        }
        for(var i = 0, len = e.after.length; i < len; i++){
            if(e.after[i].fn == fn && e.after[i].scope == scope){
                e.after.splice(i, 1);
                return;
            }
        }
    }
};

Wtf.util.Observable.prototype.on = Wtf.util.Observable.prototype.addListener;

Wtf.util.Observable.prototype.un = Wtf.util.Observable.prototype.removeListener;


Wtf.util.Observable.capture = function(o, fn, scope){
    o.fireEvent = o.fireEvent.createInterceptor(fn, scope);
};


Wtf.util.Observable.releaseCapture = function(o){
    o.fireEvent = Wtf.util.Observable.prototype.fireEvent;
};

(function(){

    var createBuffered = function(h, o, scope){
        var task = new Wtf.util.DelayedTask();
        return function(){
            task.delay(o.buffer, h, scope, Array.prototype.slice.call(arguments, 0));
        };
    };

    var createSingle = function(h, e, fn, scope){
        return function(){
            e.removeListener(fn, scope);
            return h.apply(scope, arguments);
        };
    };

    var createDelayed = function(h, o, scope){
        return function(){
            var args = Array.prototype.slice.call(arguments, 0);
            setTimeout(function(){
                h.apply(scope, args);
            }, o.delay || 10);
        };
    };

    Wtf.util.Event = function(obj, name){
        this.name = name;
        this.obj = obj;
        this.listeners = [];
    };

    Wtf.util.Event.prototype = {
        addListener : function(fn, scope, options){
            scope = scope || this.obj;
            if(!this.isListening(fn, scope)){
                var l = this.createListener(fn, scope, options);
                if(!this.firing){
                    this.listeners.push(l);
                }else{                     this.listeners = this.listeners.slice(0);
                    this.listeners.push(l);
                }
            }
        },

        createListener : function(fn, scope, o){
            o = o || {};
            scope = scope || this.obj;
            var l = {fn: fn, scope: scope, options: o};
            var h = fn;
            if(o.delay){
                h = createDelayed(h, o, scope);
            }
            if(o.single){
                h = createSingle(h, this, fn, scope);
            }
            if(o.buffer){
                h = createBuffered(h, o, scope);
            }
            l.fireFn = h;
            return l;
        },

        findListener : function(fn, scope){
            scope = scope || this.obj;
            var ls = this.listeners;
            for(var i = 0, len = ls.length; i < len; i++){
                var l = ls[i];
                if(l.fn == fn && l.scope == scope){
                    return i;
                }
            }
            return -1;
        },

        isListening : function(fn, scope){
            return this.findListener(fn, scope) != -1;
        },

        removeListener : function(fn, scope){
            var index;
            if((index = this.findListener(fn, scope)) != -1){
                if(!this.firing){
                    this.listeners.splice(index, 1);
                }else{
                    this.listeners = this.listeners.slice(0);
                    this.listeners.splice(index, 1);
                }
                return true;
            }
            return false;
        },

        clearListeners : function(){
            this.listeners = [];
        },

        fire : function(){
            var ls = this.listeners, scope, len = ls.length;
            if(len > 0){
                this.firing = true;
                var args = Array.prototype.slice.call(arguments, 0);
                for(var i = 0; i < len; i++){
                    var l = ls[i];
                    if(l.fireFn.apply(l.scope||this.obj||window, arguments) === false){
                        this.firing = false;
                        return false;
                    }
                }
                this.firing = false;
            }
            return true;
        }
    };
})();

Wtf.EventManager = function(){
    var docReadyEvent, docReadyProcId, docReadyState = false;
    var resizeEvent, resizeTask, textEvent, textSize;
    var E = Wtf.lib.Event;
    var D = Wtf.lib.Dom;


    var fireDocReady = function(){
        if(!docReadyState){
            docReadyState = true;
            Wtf.isReady = true;
            if(docReadyProcId){
                clearInterval(docReadyProcId);
            }
            if(Wtf.isGecko || Wtf.isOpera) {
                document.removeEventListener("DOMContentLoaded", fireDocReady, false);
            }
            if(Wtf.isIE){
                var defer = document.getElementById("ie-deferred-loader");
                if(defer){
                    defer.onreadystatechange = null;
                    defer.parentNode.removeChild(defer);
                }
            }
            if(docReadyEvent){
                docReadyEvent.fire();
                docReadyEvent.clearListeners();
            }
        }
    };

    var initDocReady = function(){
        docReadyEvent = new Wtf.util.Event();
        if(Wtf.isGecko || Wtf.isOpera) {
            document.addEventListener("DOMContentLoaded", fireDocReady, false);
        }else if(Wtf.isIE){
            document.write("<s"+'cript id="ie-deferred-loader" defer="defer" src="/'+'/:"></s'+"cript>");
            var defer = document.getElementById("ie-deferred-loader");
            defer.onreadystatechange = function(){
                if(this.readyState == "complete"){
                    fireDocReady();
                }
            };
        }else if(Wtf.isSafari){
            docReadyProcId = setInterval(function(){
                var rs = document.readyState;
                if(rs == "complete") {
                    fireDocReady();
                 }
            }, 10);
        }
        
        E.on(window, "load", fireDocReady);
    };

    var createBuffered = function(h, o){
        var task = new Wtf.util.DelayedTask(h);
        return function(e){
            
            e = new Wtf.EventObjectImpl(e);
            task.delay(o.buffer, h, null, [e]);
        };
    };

    var createSingle = function(h, el, ename, fn){
        return function(e){
            Wtf.EventManager.removeListener(el, ename, fn);
            h(e);
        };
    };

    var createDelayed = function(h, o){
        return function(e){
            
            e = new Wtf.EventObjectImpl(e);
            setTimeout(function(){
                h(e);
            }, o.delay || 10);
        };
    };

    var listen = function(element, ename, opt, fn, scope){
        var o = (!opt || typeof opt == "boolean") ? {} : opt;
        fn = fn || o.fn; scope = scope || o.scope;
        var el = Wtf.getDom(element);
        if(!el){
            throw "Error listening for \"" + ename + '\". Element "' + element + '" doesn\'t exist.';
        }
        var h = function(e){
            e = Wtf.EventObject.setEvent(e);
            var t;
            if(o.delegate){
                t = e.getTarget(o.delegate, el);
                if(!t){
                    return;
                }
            }else{
                t = e.target;
            }
            if(o.stopEvent === true){
                e.stopEvent();
            }
            if(o.preventDefault === true){
               e.preventDefault();
            }
            if(o.stopPropagation === true){
                e.stopPropagation();
            }

            if(o.normalized === false){
                e = e.browserEvent;
            }

            fn.call(scope || el, e, t, o);
        };
        if(o.delay){
            h = createDelayed(h, o);
        }
        if(o.single){
            h = createSingle(h, el, ename, fn);
        }
        if(o.buffer){
            h = createBuffered(h, o);
        }
        fn._handlers = fn._handlers || [];
        fn._handlers.push([Wtf.id(el), ename, h]);

        E.on(el, ename, h);
        if(ename == "mousewheel" && el.addEventListener){ 
            el.addEventListener("DOMMouseScroll", h, false);
            E.on(window, 'unload', function(){
                el.removeEventListener("DOMMouseScroll", h, false);
            });
        }
        if(ename == "mousedown" && el == document){ 
            Wtf.EventManager.stoppedMouseDownEvent.addListener(h);
        }
        return h;
    };

    var stopListening = function(el, ename, fn){
        var id = Wtf.id(el), hds = fn._handlers, hd = fn;
        if(hds){
            for(var i = 0, len = hds.length; i < len; i++){
                var h = hds[i];
                if(h[0] == id && h[1] == ename){
                    hd = h[2];
                    hds.splice(i, 1);
                    break;
                }
            }
        }
        E.un(el, ename, hd);
        el = Wtf.getDom(el);
        if(ename == "mousewheel" && el.addEventListener){
            el.removeEventListener("DOMMouseScroll", hd, false);
        }
        if(ename == "mousedown" && el == document){ 
            Wtf.EventManager.stoppedMouseDownEvent.removeListener(hd);
        }
    };

    var propRe = /^(?:scope|delay|buffer|single|stopEvent|preventDefault|stopPropagation|normalized|args|delegate)$/;
    var pub = {

    
        addListener : function(element, eventName, fn, scope, options){
            if(typeof eventName == "object"){
                var o = eventName;
                for(var e in o){
                    if(propRe.test(e)){
                        continue;
                    }
                    if(typeof o[e] == "function"){
                        
                        listen(element, e, o, o[e], o.scope);
                    }else{
                        
                        listen(element, e, o[e]);
                    }
                }
                return;
            }
            return listen(element, eventName, options, fn, scope);
        },

        
        removeListener : function(element, eventName, fn){
            return stopListening(element, eventName, fn);
        },

        
        onDocumentReady : function(fn, scope, options){
            if(docReadyState){ 
                docReadyEvent.addListener(fn, scope, options);
                docReadyEvent.fire();
                docReadyEvent.clearListeners();
                return;
            }
            if(!docReadyEvent){
                initDocReady();
            }
            docReadyEvent.addListener(fn, scope, options);
        },

        
        onWindowResize : function(fn, scope, options){
            if(!resizeEvent){
                resizeEvent = new Wtf.util.Event();
                resizeTask = new Wtf.util.DelayedTask(function(){
                    resizeEvent.fire(D.getViewWidth(), D.getViewHeight());
                });
                E.on(window, "resize", this.fireWindowResize, this);
            }
            resizeEvent.addListener(fn, scope, options);
        },

        
        fireWindowResize : function(){
            if(resizeEvent){
                if((Wtf.isIE||Wtf.isAir) && resizeTask){
                    resizeTask.delay(50);
                }else{
                    resizeEvent.fire(D.getViewWidth(), D.getViewHeight());
                }
            }
        },

        
        onTextResize : function(fn, scope, options){
            if(!textEvent){
                textEvent = new Wtf.util.Event();
                var textEl = new Wtf.Element(document.createElement('div'));
                textEl.dom.className = 'x-text-resize';
                textEl.dom.innerHTML = 'X';
                textEl.appendTo(document.body);
                textSize = textEl.dom.offsetHeight;
                setInterval(function(){
                    if(textEl.dom.offsetHeight != textSize){
                        textEvent.fire(textSize, textSize = textEl.dom.offsetHeight);
                    }
                }, this.textResizeInterval);
            }
            textEvent.addListener(fn, scope, options);
        },

        
        removeResizeListener : function(fn, scope){
            if(resizeEvent){
                resizeEvent.removeListener(fn, scope);
            }
        },

        
        fireResize : function(){
            if(resizeEvent){
                resizeEvent.fire(D.getViewWidth(), D.getViewHeight());
            }
        },
        
        ieDeferSrc : false,
        
        textResizeInterval : 50
    };
     
    pub.on = pub.addListener;
    
    pub.un = pub.removeListener;

    pub.stoppedMouseDownEvent = new Wtf.util.Event();
    return pub;
}();

Wtf.onReady = Wtf.EventManager.onDocumentReady;

Wtf.onReady(function(){
    var bd = Wtf.getBody();
    if(!bd){ return; }

    var cls = [
            Wtf.isIE ? "wtf-ie " + (Wtf.isIE6 ? 'wtf-ie6' : 'wtf-ie7')
            : Wtf.isGecko ? "wtf-gecko"
            : Wtf.isOpera ? "wtf-opera"
            : Wtf.isSafari ? "wtf-safari" : ""];

    if(Wtf.isMac){
        cls.push("wtf-mac");
    }
    if(Wtf.isLinux){
        cls.push("wtf-linux");
    }
    if(Wtf.isBorderBox){
        cls.push('wtf-border-box');
    }
    if(Wtf.isStrict){ 
        var p = bd.dom.parentNode;
        if(p){
            p.className += ' wtf-strict';
        }
    }
    bd.addClass(cls.join(' '));
});


Wtf.EventObject = function(){

    var E = Wtf.lib.Event;

    
    var safariKeys = {
        63234 : 37, 
        63235 : 39, 
        63232 : 38, 
        63233 : 40, 
        63276 : 33, 
        63277 : 34, 
        63272 : 46, 
        63273 : 36, 
        63275 : 35  
    };

    
    var btnMap = Wtf.isIE ? {1:0,4:1,2:2} :
                (Wtf.isSafari ? {1:0,2:1,3:2} : {0:0,1:1,2:2});

    Wtf.EventObjectImpl = function(e){
        if(e){
            this.setEvent(e.browserEvent || e);
        }
    };
    Wtf.EventObjectImpl.prototype = {
        
        browserEvent : null,
        
        button : -1,
        
        shiftKey : false,
        
        ctrlKey : false,
        
        altKey : false,

        
        BACKSPACE : 8,
        
        TAB : 9,
        
        RETURN : 13,
        
        ENTER : 13,
        
        SHIFT : 16,
        
        CONTROL : 17,
        
        ESC : 27,
        
        SPACE : 32,
        
        PAGEUP : 33,
        
        PAGEDOWN : 34,
        
        END : 35,
        
        HOME : 36,
        
        LEFT : 37,
        
        UP : 38,
        
        RIGHT : 39,
        
        DOWN : 40,
        
        DELETE : 46,
        
        F5 : 116,

           
        setEvent : function(e){
            if(e == this || (e && e.browserEvent)){ 
                return e;
            }
            this.browserEvent = e;
            if(e){
                
                this.button = e.button ? btnMap[e.button] : (e.which ? e.which-1 : -1);
                if(e.type == 'click' && this.button == -1){
                    this.button = 0;
                }
                this.type = e.type;
                this.shiftKey = e.shiftKey;
                
                this.ctrlKey = e.ctrlKey || e.metaKey;
                this.altKey = e.altKey;
                
                this.keyCode = e.keyCode;
                this.charCode = e.charCode;
                
                this.target = E.getTarget(e);
                
                this.xy = E.getXY(e);
            }else{
                this.button = -1;
                this.shiftKey = false;
                this.ctrlKey = false;
                this.altKey = false;
                this.keyCode = 0;
                this.charCode =0;
                this.target = null;
                this.xy = [0, 0];
            }
            return this;
        },

        
        stopEvent : function(){
            if(this.browserEvent){
                if(this.browserEvent.type == 'mousedown'){
                    Wtf.EventManager.stoppedMouseDownEvent.fire(this);
                }
                E.stopEvent(this.browserEvent);
            }
        },

        
        preventDefault : function(){
            if(this.browserEvent){
                E.preventDefault(this.browserEvent);
            }
        },

        
        isNavKeyPress : function(){
            var k = this.keyCode;
            k = Wtf.isSafari ? (safariKeys[k] || k) : k;
            return (k >= 33 && k <= 40) || k == this.RETURN || k == this.TAB || k == this.ESC;
        },

        isSpecialKey : function(){
            var k = this.keyCode;
            return (this.type == 'keypress' && this.ctrlKey) || k == 9 || k == 13  || k == 40 || k == 27 ||
            (k == 16) || (k == 17) ||
            (k >= 18 && k <= 20) ||
            (k >= 33 && k <= 35) ||
            (k >= 36 && k <= 39) ||
            (k >= 44 && k <= 45);
        },
        
        stopPropagation : function(){
            if(this.browserEvent){
                if(this.browserEvent.type == 'mousedown'){
                    Wtf.EventManager.stoppedMouseDownEvent.fire(this);
                }
                E.stopPropagation(this.browserEvent);
            }
        },

        
        getCharCode : function(){
            return this.charCode || this.keyCode;
        },

        
        getKey : function(){
            var k = this.keyCode || this.charCode;
            return Wtf.isSafari ? (safariKeys[k] || k) : k;
        },

        
        getPageX : function(){
            return this.xy[0];
        },

        
        getPageY : function(){
            return this.xy[1];
        },

        
        getTime : function(){
            if(this.browserEvent){
                return E.getTime(this.browserEvent);
            }
            return null;
        },

        
        getXY : function(){
            return this.xy;
        },

        
        getTarget : function(selector, maxDepth, returnEl){
        	var t = Wtf.get(this.target);
            return selector ? t.findParent(selector, maxDepth, returnEl) : (returnEl ? t : this.target);
        },
        
        
        getRelatedTarget : function(){
            if(this.browserEvent){
                return E.getRelatedTarget(this.browserEvent);
            }
            return null;
        },

        
        getWheelDelta : function(){
            var e = this.browserEvent;
            var delta = 0;
            if(e.wheelDelta){ 
                delta = e.wheelDelta/120;
            }else if(e.detail){ 
                delta = -e.detail/3;
            }
            return delta;
        },

        
        hasModifier : function(){
            return ((this.ctrlKey || this.altKey) || this.shiftKey) ? true : false;
        },

        
        within : function(el, related){
            var t = this[related ? "getRelatedTarget" : "getTarget"]();
            return t && Wtf.fly(el).contains(t);
        },

        getPoint : function(){
            return new Wtf.lib.Point(this.xy[0], this.xy[1]);
        }
    };

    return new Wtf.EventObjectImpl();
}();

(function(){
var D = Wtf.lib.Dom;
var E = Wtf.lib.Event;
var A = Wtf.lib.Anim;


var propCache = {};
var camelRe = /(-[a-z])/gi;
var camelFn = function(m, a){ return a.charAt(1).toUpperCase(); };
var view = document.defaultView;

Wtf.Element = function(element, forceNew){
    var dom = typeof element == "string" ?
            document.getElementById(element) : element;
    if(!dom){ 
        return null;
    }
    var id = dom.id;
    if(forceNew !== true && id && Wtf.Element.cache[id]){ 
        return Wtf.Element.cache[id];
    }

    
    this.dom = dom;

    
    this.id = id || Wtf.id(dom);
};

var El = Wtf.Element;

El.prototype = {
    
    originalDisplay : "",

    visibilityMode : 1,
    
    defaultUnit : "px",
    
    setVisibilityMode : function(visMode){
        this.visibilityMode = visMode;
        return this;
    },
    
    enableDisplayMode : function(display){
        this.setVisibilityMode(El.DISPLAY);
        if(typeof display != "undefined") this.originalDisplay = display;
        return this;
    },

    
    findParent : function(simpleSelector, maxDepth, returnEl){
        var p = this.dom, b = document.body, depth = 0, dq = Wtf.DomQuery, stopEl;
        maxDepth = maxDepth || 50;
        if(typeof maxDepth != "number"){
            stopEl = Wtf.getDom(maxDepth);
            maxDepth = 10;
        }
        while(p && p.nodeType == 1 && depth < maxDepth && p != b && p != stopEl){
            if(dq.is(p, simpleSelector)){
                return returnEl ? Wtf.get(p) : p;
            }
            depth++;
            p = p.parentNode;
        }
        return null;
    },


    
    findParentNode : function(simpleSelector, maxDepth, returnEl){
        var p = Wtf.fly(this.dom.parentNode, '_internal');
        return p ? p.findParent(simpleSelector, maxDepth, returnEl) : null;
    },

    
    up : function(simpleSelector, maxDepth){
        return this.findParentNode(simpleSelector, maxDepth, true);
    },



    
    is : function(simpleSelector){
        return Wtf.DomQuery.is(this.dom, simpleSelector);
    },

    
    animate : function(args, duration, onComplete, easing, animType){
        this.anim(args, {duration: duration, callback: onComplete, easing: easing}, animType);
        return this;
    },

    
    anim : function(args, opt, animType, defaultDur, defaultEase, cb){
        animType = animType || 'run';
        opt = opt || {};
        var anim = Wtf.lib.Anim[animType](
            this.dom, args,
            (opt.duration || defaultDur) || .35,
            (opt.easing || defaultEase) || 'easeOut',
            function(){
                Wtf.callback(cb, this);
                Wtf.callback(opt.callback, opt.scope || this, [this, opt]);
            },
            this
        );
        opt.anim = anim;
        return anim;
    },

    
    preanim : function(a, i){
        return !a[i] ? false : (typeof a[i] == "object" ? a[i]: {duration: a[i+1], callback: a[i+2], easing: a[i+3]});
    },

    
    clean : function(forceReclean){
        if(this.isCleaned && forceReclean !== true){
            return this;
        }
        var ns = /\S/;
        var d = this.dom, n = d.firstChild, ni = -1;
 	    while(n){
 	        var nx = n.nextSibling;
 	        if(n.nodeType == 3 && !ns.test(n.nodeValue)){
 	            d.removeChild(n);
 	        }else{
 	            n.nodeIndex = ++ni;
 	        }
 	        n = nx;
 	    }
 	    this.isCleaned = true;
 	    return this;
 	},

    
    scrollIntoView : function(container, hscroll){
        var c = Wtf.getDom(container) || Wtf.getBody().dom;
        var el = this.dom;

        var o = this.getOffsetsTo(c),
            l = o[0] + c.scrollLeft,
            t = o[1] + c.scrollTop,
            b = t+el.offsetHeight,
            r = l+el.offsetWidth;

        var ch = c.clientHeight;
        var ct = parseInt(c.scrollTop, 10);
        var cl = parseInt(c.scrollLeft, 10);
        var cb = ct + ch;
        var cr = cl + c.clientWidth;

        if(el.offsetHeight > ch || t < ct){
        	c.scrollTop = t;
        }else if(b > cb){
            c.scrollTop = b-ch;
        }
        c.scrollTop = c.scrollTop; 

        if(hscroll !== false){
			if(el.offsetWidth > c.clientWidth || l < cl){
                c.scrollLeft = l;
            }else if(r > cr){
                c.scrollLeft = r-c.clientWidth;
            }
            c.scrollLeft = c.scrollLeft;
        }
        return this;
    },

    
    scrollChildIntoView : function(child, hscroll){
        Wtf.fly(child, '_scrollChildIntoView').scrollIntoView(this, hscroll);
    },

    
    autoHeight : function(animate, duration, onComplete, easing){
        var oldHeight = this.getHeight();
        this.clip();
        this.setHeight(1); 
        setTimeout(function(){
            var height = parseInt(this.dom.scrollHeight, 10); 
            if(!animate){
                this.setHeight(height);
                this.unclip();
                if(typeof onComplete == "function"){
                    onComplete();
                }
            }else{
                this.setHeight(oldHeight); 
                this.setHeight(height, animate, duration, function(){
                    this.unclip();
                    if(typeof onComplete == "function") onComplete();
                }.createDelegate(this), easing);
            }
        }.createDelegate(this), 0);
        return this;
    },

    
    contains : function(el){
        if(!el){return false;}
        return D.isAncestor(this.dom, el.dom ? el.dom : el);
    },

    
    isVisible : function(deep) {
        var vis = !(this.getStyle("visibility") == "hidden" || this.getStyle("display") == "none");
        if(deep !== true || !vis){
            return vis;
        }
        var p = this.dom.parentNode;
        while(p && p.tagName.toLowerCase() != "body"){
            if(!Wtf.fly(p, '_isVisible').isVisible()){
                return false;
            }
            p = p.parentNode;
        }
        return true;
    },

    
    select : function(selector, unique){
        return El.select(selector, unique, this.dom);
    },

    
    query : function(selector, unique){
        return Wtf.DomQuery.select(selector, this.dom);
    },

    
    child : function(selector, returnDom){
        var n = Wtf.DomQuery.selectNode(selector, this.dom);
        return returnDom ? n : Wtf.get(n);
    },

    
    down : function(selector, returnDom){
        var n = Wtf.DomQuery.selectNode(" > " + selector, this.dom);
        return returnDom ? n : Wtf.get(n);
    },

    
    initDD : function(group, config, overrides){
        var dd = new Wtf.dd.DD(Wtf.id(this.dom), group, config);
        return Wtf.apply(dd, overrides);
    },

    
    initDDProxy : function(group, config, overrides){
        var dd = new Wtf.dd.DDProxy(Wtf.id(this.dom), group, config);
        return Wtf.apply(dd, overrides);
    },

    
    initDDTarget : function(group, config, overrides){
        var dd = new Wtf.dd.DDTarget(Wtf.id(this.dom), group, config);
        return Wtf.apply(dd, overrides);
    },

    
     setVisible : function(visible, animate){
        if(!animate || !A){
            if(this.visibilityMode == El.DISPLAY){
                this.setDisplayed(visible);
            }else{
                this.fixDisplay();
                this.dom.style.visibility = visible ? "visible" : "hidden";
            }
        }else{
            
            var dom = this.dom;
            var visMode = this.visibilityMode;
            if(visible){
                this.setOpacity(.01);
                this.setVisible(true);
            }
            this.anim({opacity: { to: (visible?1:0) }},
                  this.preanim(arguments, 1),
                  null, .35, 'easeIn', function(){
                     if(!visible){
                         if(visMode == El.DISPLAY){
                             dom.style.display = "none";
                         }else{
                             dom.style.visibility = "hidden";
                         }
                         Wtf.get(dom).setOpacity(1);
                     }
                 });
        }
        return this;
    },

    
    isDisplayed : function() {
        return this.getStyle("display") != "none";
    },

    
    toggle : function(animate){
        this.setVisible(!this.isVisible(), this.preanim(arguments, 0));
        return this;
    },

    
    setDisplayed : function(value) {
        if(typeof value == "boolean"){
           value = value ? this.originalDisplay : "none";
        }
        this.setStyle("display", value);
        return this;
    },

    
    focus : function() {
        try{
            this.dom.focus();
        }catch(e){}
        return this;
    },

    
    blur : function() {
        try{
            this.dom.blur();
        }catch(e){}
        return this;
    },

    
    addClass : function(className){
        if(className instanceof Array){
            for(var i = 0, len = className.length; i < len; i++) {
            	this.addClass(className[i]);
            }
        }else{
            if(className && !this.hasClass(className)){
                this.dom.className = this.dom.className + " " + className;
            }
        }
        return this;
    },

    
    radioClass : function(className){
        var siblings = this.dom.parentNode.childNodes;
        for(var i = 0; i < siblings.length; i++) {
        	var s = siblings[i];
        	if(s.nodeType == 1){
        	    Wtf.get(s).removeClass(className);
        	}
        }
        this.addClass(className);
        return this;
    },

    
    removeClass : function(className){
        if(!className || !this.dom.className){
            return this;
        }
        if(className instanceof Array){
            for(var i = 0, len = className.length; i < len; i++) {
            	this.removeClass(className[i]);
            }
        }else{
            if(this.hasClass(className)){
                var re = this.classReCache[className];
                if (!re) {
                   re = new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)', "g");
                   this.classReCache[className] = re;
                }
                this.dom.className =
                    this.dom.className.replace(re, " ");
            }
        }
        return this;
    },

    
    classReCache: {},

    
    toggleClass : function(className){
        if(this.hasClass(className)){
            this.removeClass(className);
        }else{
            this.addClass(className);
        }
        return this;
    },

    
    hasClass : function(className){
        return className && (' '+this.dom.className+' ').indexOf(' '+className+' ') != -1;
    },

    
    replaceClass : function(oldClassName, newClassName){
        this.removeClass(oldClassName);
        this.addClass(newClassName);
        return this;
    },

    
    getStyles : function(){
        var a = arguments, len = a.length, r = {};
        for(var i = 0; i < len; i++){
            r[a[i]] = this.getStyle(a[i]);
        }
        return r;
    },

    
    getStyle : function(){
        return view && view.getComputedStyle ?
            function(prop){
                var el = this.dom, v, cs, camel;
                if(prop == 'float'){
                    prop = "cssFloat";
                }
                if(v = el.style[prop]){
                    return v;
                }
                if(cs = view.getComputedStyle(el, "")){
                    if(!(camel = propCache[prop])){
                        camel = propCache[prop] = prop.replace(camelRe, camelFn);
                    }
                    return cs[camel];
                }
                return null;
            } :
            function(prop){
                var el = this.dom, v, cs, camel;
                if(prop == 'opacity'){
                    if(typeof el.style.filter == 'string'){
                        var m = el.style.filter.match(/alpha\(opacity=(.*)\)/i);
                        if(m){
                            var fv = parseFloat(m[1]);
                            if(!isNaN(fv)){
                                return fv ? fv / 100 : 0;
                            }
                        }
                    }
                    return 1;
                }else if(prop == 'float'){
                    prop = "styleFloat";
                }
                if(!(camel = propCache[prop])){
                    camel = propCache[prop] = prop.replace(camelRe, camelFn);
                }
                if(v = el.style[camel]){
                    return v;
                }
                if(cs = el.currentStyle){
                    return cs[camel];
                }
                return null;
            };
    }(),

    
    setStyle : function(prop, value){
        if(typeof prop == "string"){
            var camel;
            if(!(camel = propCache[prop])){
                camel = propCache[prop] = prop.replace(camelRe, camelFn);
            }
            if(camel == 'opacity') {
                this.setOpacity(value);
            }else{
                this.dom.style[camel] = value;
            }
        }else{
            for(var style in prop){
                if(typeof prop[style] != "function"){
                   this.setStyle(style, prop[style]);
                }
            }
        }
        return this;
    },

    
    applyStyles : function(style){
        Wtf.DomHelper.applyStyles(this.dom, style);
        return this;
    },

    
    getX : function(){
        return D.getX(this.dom);
    },

    
    getY : function(){
        return D.getY(this.dom);
    },

    
    getXY : function(){
        return D.getXY(this.dom);
    },

    
    getOffsetsTo : function(el){
        var o = this.getXY();
        var e = Wtf.fly(el, '_internal').getXY();
        return [o[0]-e[0],o[1]-e[1]];
    },

    
    setX : function(x, animate){
        if(!animate || !A){
            D.setX(this.dom, x);
        }else{
            this.setXY([x, this.getY()], this.preanim(arguments, 1));
        }
        return this;
    },

    
    setY : function(y, animate){
        if(!animate || !A){
            D.setY(this.dom, y);
        }else{
            this.setXY([this.getX(), y], this.preanim(arguments, 1));
        }
        return this;
    },

    
    setLeft : function(left){
        this.setStyle("left", this.addUnits(left));
        return this;
    },

    
    setTop : function(top){
        this.setStyle("top", this.addUnits(top));
        return this;
    },

    
    setRight : function(right){
        this.setStyle("right", this.addUnits(right));
        return this;
    },

    
    setBottom : function(bottom){
        this.setStyle("bottom", this.addUnits(bottom));
        return this;
    },

    
    setXY : function(pos, animate){
        if(!animate || !A){
            D.setXY(this.dom, pos);
        }else{
            this.anim({points: {to: pos}}, this.preanim(arguments, 1), 'motion');
        }
        return this;
    },

    
    setLocation : function(x, y, animate){
        this.setXY([x, y], this.preanim(arguments, 2));
        return this;
    },

    
    moveTo : function(x, y, animate){
        this.setXY([x, y], this.preanim(arguments, 2));
        return this;
    },

    
    getRegion : function(){
        return D.getRegion(this.dom);
    },

    
    getHeight : function(contentHeight){
        var h = this.dom.offsetHeight || 0;
        h = contentHeight !== true ? h : h-this.getBorderWidth("tb")-this.getPadding("tb");
        return h < 0 ? 0 : h;
    },

    
    getWidth : function(contentWidth){
        var w = this.dom.offsetWidth || 0;
        w = contentWidth !== true ? w : w-this.getBorderWidth("lr")-this.getPadding("lr");
        return w < 0 ? 0 : w;
    },

    
    getComputedHeight : function(){
        var h = Math.max(this.dom.offsetHeight, this.dom.clientHeight);
        if(!h){
            h = parseInt(this.getStyle('height'), 10) || 0;
            if(!this.isBorderBox()){
                h += this.getFrameWidth('tb');
            }
        }
        return h;
    },

    
    getComputedWidth : function(){
        var w = Math.max(this.dom.offsetWidth, this.dom.clientWidth);
        if(!w){
            w = parseInt(this.getStyle('width'), 10) || 0;
            if(!this.isBorderBox()){
                w += this.getFrameWidth('lr');
            }
        }
        return w;
    },

    
    getSize : function(contentSize){
        return {width: this.getWidth(contentSize), height: this.getHeight(contentSize)};
    },

    getStyleSize : function(){
        var w, h, d = this.dom, s = d.style;
        if(s.width && s.width != 'auto'){
            w = parseInt(s.width, 10);
            if(Wtf.isBorderBox){
               w -= this.getFrameWidth('lr');
            }
        }
        if(s.height && s.height != 'auto'){
            h = parseInt(s.height, 10);
            if(Wtf.isBorderBox){
               h -= this.getFrameWidth('tb');
            }
        }
        return {width: w || this.getWidth(true), height: h || this.getHeight(true)};

    },

    
    getViewSize : function(){
        var d = this.dom, doc = document, aw = 0, ah = 0;
        if(d == doc || d == doc.body){
            return {width : D.getViewWidth(), height: D.getViewHeight()};
        }else{
            return {
                width : d.clientWidth,
                height: d.clientHeight
            };
        }
    },

    
    getValue : function(asNumber){
        return asNumber ? parseInt(this.dom.value, 10) : this.dom.value;
    },

    
    adjustWidth : function(width){
        if(typeof width == "number"){
            if(this.autoBoxAdjust && !this.isBorderBox()){
               width -= (this.getBorderWidth("lr") + this.getPadding("lr"));
            }
            if(width < 0){
                width = 0;
            }
        }
        return width;
    },

    
    adjustHeight : function(height){
        if(typeof height == "number"){
           if(this.autoBoxAdjust && !this.isBorderBox()){
               height -= (this.getBorderWidth("tb") + this.getPadding("tb"));
           }
           if(height < 0){
               height = 0;
           }
        }
        return height;
    },

    
    setWidth : function(width, animate){
        width = this.adjustWidth(width);
        if(!animate || !A){
            this.dom.style.width = this.addUnits(width);
        }else{
            this.anim({width: {to: width}}, this.preanim(arguments, 1));
        }
        return this;
    },

    
     setHeight : function(height, animate){
        height = this.adjustHeight(height);
        if(!animate || !A){
            this.dom.style.height = this.addUnits(height);
        }else{
            this.anim({height: {to: height}}, this.preanim(arguments, 1));
        }
        return this;
    },

    
     setSize : function(width, height, animate){
        if(typeof width == "object"){ 
            height = width.height; width = width.width;
        }
        width = this.adjustWidth(width); height = this.adjustHeight(height);
        if(!animate || !A){
            this.dom.style.width = this.addUnits(width);
            this.dom.style.height = this.addUnits(height);
        }else{
            this.anim({width: {to: width}, height: {to: height}}, this.preanim(arguments, 2));
        }
        return this;
    },

    
    setBounds : function(x, y, width, height, animate){
        if(!animate || !A){
            this.setSize(width, height);
            this.setLocation(x, y);
        }else{
            width = this.adjustWidth(width); height = this.adjustHeight(height);
            this.anim({points: {to: [x, y]}, width: {to: width}, height: {to: height}},
                          this.preanim(arguments, 4), 'motion');
        }
        return this;
    },

    
    setRegion : function(region, animate){
        this.setBounds(region.left, region.top, region.right-region.left, region.bottom-region.top, this.preanim(arguments, 1));
        return this;
    },

    
    addListener : function(eventName, fn, scope, options){
        Wtf.EventManager.on(this.dom,  eventName, fn, scope || this, options);
    },

    
    removeListener : function(eventName, fn){
        Wtf.EventManager.removeListener(this.dom,  eventName, fn);
        return this;
    },

    
    removeAllListeners : function(){
        E.purgeElement(this.dom);
        return this;
    },

    
    relayEvent : function(eventName, observable){
        this.on(eventName, function(e){
            observable.fireEvent(eventName, e);
        });
    },

    
     setOpacity : function(opacity, animate){
        if(!animate || !A){
            var s = this.dom.style;
            if(Wtf.isIE){
                s.zoom = 1;
                s.filter = (s.filter || '').replace(/alpha\([^\)]*\)/gi,"") +
                           (opacity == 1 ? "" : " alpha(opacity=" + opacity * 100 + ")");
            }else{
                s.opacity = opacity;
            }
        }else{
            this.anim({opacity: {to: opacity}}, this.preanim(arguments, 1), null, .35, 'easeIn');
        }
        return this;
    },

    
    getLeft : function(local){
        if(!local){
            return this.getX();
        }else{
            return parseInt(this.getStyle("left"), 10) || 0;
        }
    },

    
    getRight : function(local){
        if(!local){
            return this.getX() + this.getWidth();
        }else{
            return (this.getLeft(true) + this.getWidth()) || 0;
        }
    },

    
    getTop : function(local) {
        if(!local){
            return this.getY();
        }else{
            return parseInt(this.getStyle("top"), 10) || 0;
        }
    },

    
    getBottom : function(local){
        if(!local){
            return this.getY() + this.getHeight();
        }else{
            return (this.getTop(true) + this.getHeight()) || 0;
        }
    },

    
    position : function(pos, zIndex, x, y){
        if(!pos){
           if(this.getStyle('position') == 'static'){
               this.setStyle('position', 'relative');
           }
        }else{
            this.setStyle("position", pos);
        }
        if(zIndex){
            this.setStyle("z-index", zIndex);
        }
        if(x !== undefined && y !== undefined){
            this.setXY([x, y]);
        }else if(x !== undefined){
            this.setX(x);
        }else if(y !== undefined){
            this.setY(y);
        }
    },

    
    clearPositioning : function(value){
        value = value ||'';
        this.setStyle({
            "left": value,
            "right": value,
            "top": value,
            "bottom": value,
            "z-index": "",
            "position" : "static"
        });
        return this;
    },

    
    getPositioning : function(){
        var l = this.getStyle("left");
        var t = this.getStyle("top");
        return {
            "position" : this.getStyle("position"),
            "left" : l,
            "right" : l ? "" : this.getStyle("right"),
            "top" : t,
            "bottom" : t ? "" : this.getStyle("bottom"),
            "z-index" : this.getStyle("z-index")
        };
    },

    
    getBorderWidth : function(side){
        return this.addStyles(side, El.borders);
    },

    
    getPadding : function(side){
        return this.addStyles(side, El.paddings);
    },

    
    setPositioning : function(pc){
        this.applyStyles(pc);
        if(pc.right == "auto"){
            this.dom.style.right = "";
        }
        if(pc.bottom == "auto"){
            this.dom.style.bottom = "";
        }
        return this;
    },

    
    fixDisplay : function(){
        if(this.getStyle("display") == "none"){
            this.setStyle("visibility", "hidden");
            this.setStyle("display", this.originalDisplay); 
            if(this.getStyle("display") == "none"){ 
                this.setStyle("display", "block");
            }
        }
    },

    
     setLeftTop : function(left, top){
        this.dom.style.left = this.addUnits(left);
        this.dom.style.top = this.addUnits(top);
        return this;
    },

    
     move : function(direction, distance, animate){
        var xy = this.getXY();
        direction = direction.toLowerCase();
        switch(direction){
            case "l":
            case "left":
                this.moveTo(xy[0]-distance, xy[1], this.preanim(arguments, 2));
                break;
           case "r":
           case "right":
                this.moveTo(xy[0]+distance, xy[1], this.preanim(arguments, 2));
                break;
           case "t":
           case "top":
           case "up":
                this.moveTo(xy[0], xy[1]-distance, this.preanim(arguments, 2));
                break;
           case "b":
           case "bottom":
           case "down":
                this.moveTo(xy[0], xy[1]+distance, this.preanim(arguments, 2));
                break;
        }
        return this;
    },

    
    clip : function(){
        if(!this.isClipped){
           this.isClipped = true;
           this.originalClip = {
               "o": this.getStyle("overflow"),
               "x": this.getStyle("overflow-x"),
               "y": this.getStyle("overflow-y")
           };
           this.setStyle("overflow", "hidden");
           this.setStyle("overflow-x", "hidden");
           this.setStyle("overflow-y", "hidden");
        }
        return this;
    },

    
    unclip : function(){
        if(this.isClipped){
            this.isClipped = false;
            var o = this.originalClip;
            if(o.o){this.setStyle("overflow", o.o);}
            if(o.x){this.setStyle("overflow-x", o.x);}
            if(o.y){this.setStyle("overflow-y", o.y);}
        }
        return this;
    },


    
    getAnchorXY : function(anchor, local, s){
        
        

        var w, h, vp = false;
        if(!s){
            var d = this.dom;
            if(d == document.body || d == document){
                vp = true;
                w = D.getViewWidth(); h = D.getViewHeight();
            }else{
                w = this.getWidth(); h = this.getHeight();
            }
        }else{
            w = s.width;  h = s.height;
        }
        var x = 0, y = 0, r = Math.round;
        switch((anchor || "tl").toLowerCase()){
            case "c":
                x = r(w*.5);
                y = r(h*.5);
            break;
            case "t":
                x = r(w*.5);
                y = 0;
            break;
            case "l":
                x = 0;
                y = r(h*.5);
            break;
            case "r":
                x = w;
                y = r(h*.5);
            break;
            case "b":
                x = r(w*.5);
                y = h;
            break;
            case "tl":
                x = 0;
                y = 0;
            break;
            case "bl":
                x = 0;
                y = h;
            break;
            case "br":
                x = w;
                y = h;
            break;
            case "tr":
                x = w;
                y = 0;
            break;
        }
        if(local === true){
            return [x, y];
        }
        if(vp){
            var sc = this.getScroll();
            return [x + sc.left, y + sc.top];
        }
        
        var o = this.getXY();
        return [x+o[0], y+o[1]];
    },

    
    getAlignToXY : function(el, p, o){
        el = Wtf.get(el);
        if(!el || !el.dom){
            throw "Element.alignToXY with an element that doesn't exist";
        }
        var d = this.dom;
        var c = false; 
        var p1 = "", p2 = "";
        o = o || [0,0];

        if(!p){
            p = "tl-bl";
        }else if(p == "?"){
            p = "tl-bl?";
        }else if(p.indexOf("-") == -1){
            p = "tl-" + p;
        }
        p = p.toLowerCase();
        var m = p.match(/^([a-z]+)-([a-z]+)(\?)?$/);
        if(!m){
           throw "Element.alignTo with an invalid alignment " + p;
        }
        p1 = m[1]; p2 = m[2]; c = !!m[3];

        
        
        var a1 = this.getAnchorXY(p1, true);
        var a2 = el.getAnchorXY(p2, false);

        var x = a2[0] - a1[0] + o[0];
        var y = a2[1] - a1[1] + o[1];

        if(c){
            
            var w = this.getWidth(), h = this.getHeight(), r = el.getRegion();
            
            var dw = D.getViewWidth()-5, dh = D.getViewHeight()-5;

            
            
            
            var p1y = p1.charAt(0), p1x = p1.charAt(p1.length-1);
           var p2y = p2.charAt(0), p2x = p2.charAt(p2.length-1);
           var swapY = ((p1y=="t" && p2y=="b") || (p1y=="b" && p2y=="t"));
           var swapX = ((p1x=="r" && p2x=="l") || (p1x=="l" && p2x=="r"));

           var doc = document;
           var scrollX = (doc.documentElement.scrollLeft || doc.body.scrollLeft || 0)+5;
           var scrollY = (doc.documentElement.scrollTop || doc.body.scrollTop || 0)+5;

           if((x+w) > dw + scrollX){
                x = swapX ? r.left-w : dw+scrollX-w;
            }
           if(x < scrollX){
               x = swapX ? r.right : scrollX;
           }
           if((y+h) > dh + scrollY){
                y = swapY ? r.top-h : dh+scrollY-h;
            }
           if (y < scrollY){
               y = swapY ? r.bottom : scrollY;
           }
        }
        return [x,y];
    },

    
    getConstrainToXY : function(){
        var os = {top:0, left:0, bottom:0, right: 0};

        return function(el, local, offsets, proposedXY){
            el = Wtf.get(el);
            offsets = offsets ? Wtf.applyIf(offsets, os) : os;

            var vw, vh, vx = 0, vy = 0;
            if(el.dom == document.body || el.dom == document){
                vw = Wtf.lib.Dom.getViewWidth();
                vh = Wtf.lib.Dom.getViewHeight();
            }else{
                vw = el.dom.clientWidth;
                vh = el.dom.clientHeight;
                if(!local){
                    var vxy = el.getXY();
                    vx = vxy[0];
                    vy = vxy[1];
                }
            }

            var s = el.getScroll();

            vx += offsets.left + s.left;
            vy += offsets.top + s.top;

            vw -= offsets.right;
            vh -= offsets.bottom;

            var vr = vx+vw;
            var vb = vy+vh;

            var xy = proposedXY || (!local ? this.getXY() : [this.getLeft(true), this.getTop(true)]);
            var x = xy[0], y = xy[1];
            var w = this.dom.offsetWidth, h = this.dom.offsetHeight;

            
            var moved = false;

            
            if((x + w) > vr){
                x = vr - w;
                moved = true;
            }
            if((y + h) > vb){
                y = vb - h;
                moved = true;
            }
            
            if(x < vx){
                x = vx;
                moved = true;
            }
            if(y < vy){
                y = vy;
                moved = true;
            }
            return moved ? [x, y] : false;
        };
    }(),

    
    adjustForConstraints : function(xy, parent, offsets){
        return this.getConstrainToXY(parent || document, false, offsets, xy) ||  xy;
    },

    
    alignTo : function(element, position, offsets, animate){
        var xy = this.getAlignToXY(element, position, offsets);
        this.setXY(xy, this.preanim(arguments, 3));
        return this;
    },

    
    anchorTo : function(el, alignment, offsets, animate, monitorScroll, callback){
        var action = function(){
            this.alignTo(el, alignment, offsets, animate);
            Wtf.callback(callback, this);
        };
        Wtf.EventManager.onWindowResize(action, this);
        var tm = typeof monitorScroll;
        if(tm != 'undefined'){
            Wtf.EventManager.on(window, 'scroll', action, this,
                {buffer: tm == 'number' ? monitorScroll : 50});
        }
        action.call(this); 
        return this;
    },
    
    clearOpacity : function(){
        if (window.ActiveXObject) {
            if(typeof this.dom.style.filter == 'string' && (/alpha/i).test(this.dom.style.filter)){
                this.dom.style.filter = "";
            }
        } else {
            this.dom.style.opacity = "";
            this.dom.style["-moz-opacity"] = "";
            this.dom.style["-khtml-opacity"] = "";
        }
        return this;
    },

    
    hide : function(animate){
        this.setVisible(false, this.preanim(arguments, 0));
        return this;
    },

    
    show : function(animate){
        this.setVisible(true, this.preanim(arguments, 0));
        return this;
    },

    
    addUnits : function(size){
        return Wtf.Element.addUnits(size, this.defaultUnit);
    },

    
    update : function(html, loadScripts, callback){
        if(typeof html == "undefined"){
            html = "";
        }
        if(loadScripts !== true){
            this.dom.innerHTML = html;
            if(typeof callback == "function"){
                callback();
            }
            return this;
        }
        var id = Wtf.id();
        var dom = this.dom;

        html += '<span id="' + id + '"></span>';

        E.onAvailable(id, function(){
            var hd = document.getElementsByTagName("head")[0];
            var re = /(?:<script([^>]*)?>)((\n|\r|.)*?)(?:<\/script>)/ig;
            var srcRe = /\ssrc=([\'\"])(.*?)\1/i;
            var typeRe = /\stype=([\'\"])(.*?)\1/i;

            var match;
            while(match = re.exec(html)){
                var attrs = match[1];
                var srcMatch = attrs ? attrs.match(srcRe) : false;
                if(srcMatch && srcMatch[2]){
                   var s = document.createElement("script");
                   s.src = srcMatch[2];
                   var typeMatch = attrs.match(typeRe);
                   if(typeMatch && typeMatch[2]){
                       s.type = typeMatch[2];
                   }
                   hd.appendChild(s);
                }else if(match[2] && match[2].length > 0){
                    if(window.execScript) {
                       window.execScript(match[2]);
                    } else {
                       window.eval(match[2]);
                    }
                }
            }
            var el = document.getElementById(id);
            if(el){Wtf.removeNode(el);}
            if(typeof callback == "function"){
                callback();
            }
        });
        dom.innerHTML = html.replace(/(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)/ig, "");
        return this;
    },

    
    load : function(){
        var um = this.getUpdater();
        um.update.apply(um, arguments);
        return this;
    },

    
    getUpdater : function(){
        if(!this.updateManager){
            this.updateManager = new Wtf.Updater(this);
        }
        return this.updateManager;
    },

    
    unselectable : function(){
        this.dom.unselectable = "on";
        this.swallowEvent("selectstart", true);
        this.applyStyles("-moz-user-select:none;-khtml-user-select:none;");
        this.addClass("x-unselectable");
        return this;
    },

    
    getCenterXY : function(){
        return this.getAlignToXY(document, 'c-c');
    },

    
    center : function(centerIn){
        this.alignTo(centerIn || document, 'c-c');
        return this;
    },

    
    isBorderBox : function(){
        return noBoxAdjust[this.dom.tagName.toLowerCase()] || Wtf.isBorderBox;
    },

    
    getBox : function(contentBox, local){
        var xy;
        if(!local){
            xy = this.getXY();
        }else{
            var left = parseInt(this.getStyle("left"), 10) || 0;
            var top = parseInt(this.getStyle("top"), 10) || 0;
            xy = [left, top];
        }
        var el = this.dom, w = el.offsetWidth, h = el.offsetHeight, bx;
        if(!contentBox){
            bx = {x: xy[0], y: xy[1], 0: xy[0], 1: xy[1], width: w, height: h};
        }else{
            var l = this.getBorderWidth("l")+this.getPadding("l");
            var r = this.getBorderWidth("r")+this.getPadding("r");
            var t = this.getBorderWidth("t")+this.getPadding("t");
            var b = this.getBorderWidth("b")+this.getPadding("b");
            bx = {x: xy[0]+l, y: xy[1]+t, 0: xy[0]+l, 1: xy[1]+t, width: w-(l+r), height: h-(t+b)};
        }
        bx.right = bx.x + bx.width;
        bx.bottom = bx.y + bx.height;
        return bx;
    },

    
    getFrameWidth : function(sides, onlyContentBox){
        return onlyContentBox && Wtf.isBorderBox ? 0 : (this.getPadding(sides) + this.getBorderWidth(sides));
    },

    
    setBox : function(box, adjust, animate){
        var w = box.width, h = box.height;
        if((adjust && !this.autoBoxAdjust) && !this.isBorderBox()){
           w -= (this.getBorderWidth("lr") + this.getPadding("lr"));
           h -= (this.getBorderWidth("tb") + this.getPadding("tb"));
        }
        this.setBounds(box.x, box.y, w, h, this.preanim(arguments, 2));
        return this;
    },

    
     repaint : function(){
        var dom = this.dom;
        this.addClass("x-repaint");
        setTimeout(function(){
            Wtf.get(dom).removeClass("x-repaint");
        }, 1);
        return this;
    },

    
    getMargins : function(side){
        if(!side){
            return {
                top: parseInt(this.getStyle("margin-top"), 10) || 0,
                left: parseInt(this.getStyle("margin-left"), 10) || 0,
                bottom: parseInt(this.getStyle("margin-bottom"), 10) || 0,
                right: parseInt(this.getStyle("margin-right"), 10) || 0
            };
        }else{
            return this.addStyles(side, El.margins);
         }
    },

    
    addStyles : function(sides, styles){
        var val = 0, v, w;
        for(var i = 0, len = sides.length; i < len; i++){
            v = this.getStyle(styles[sides.charAt(i)]);
            if(v){
                 w = parseInt(v, 10);
                 if(w){ val += (w >= 0 ? w : -1 * w); }
            }
        }
        return val;
    },

    
    createProxy : function(config, renderTo, matchBox){
        config = typeof config == "object" ?
            config : {tag : "div", cls: config};

        var proxy;
        if(renderTo){
            proxy = Wtf.DomHelper.append(renderTo, config, true);
        }else {
            proxy = Wtf.DomHelper.insertBefore(this.dom, config, true);
        }
        if(matchBox){
           proxy.setBox(this.getBox());
        }
        return proxy;
    },

    
    mask : function(msg, msgCls){
        if(this.getStyle("position") == "static"){
            this.setStyle("position", "relative");
        }
        if(this._maskMsg){
            this._maskMsg.remove();
        }
        if(this._mask){
            this._mask.remove();
        }

        this._mask = Wtf.DomHelper.append(this.dom, {cls:"wtf-el-mask"}, true);

        this.addClass("x-masked");
        this._mask.setDisplayed(true);
        if(typeof msg == 'string'){
            this._maskMsg = Wtf.DomHelper.append(this.dom, {cls:"wtf-el-mask-msg", cn:{tag:'div'}}, true);
            var mm = this._maskMsg;
            mm.dom.className = msgCls ? "wtf-el-mask-msg " + msgCls : "wtf-el-mask-msg";
            mm.dom.firstChild.innerHTML = msg;
            mm.setDisplayed(true);
            mm.center(this);
        }
        if(Wtf.isIE && !(Wtf.isIE7 && Wtf.isStrict) && this.getStyle('height') == 'auto'){ 
            this._mask.setSize(this.dom.clientWidth, this.getHeight());
        }
        return this._mask;
    },

    
    unmask : function(){
        if(this._mask){
            if(this._maskMsg){
                this._maskMsg.remove();
                delete this._maskMsg;
            }
            this._mask.remove();
            delete this._mask;
        }
        this.removeClass("x-masked");
    },

    
    isMasked : function(){
        return this._mask && this._mask.isVisible();
    },

    
    createShim : function(){
        var el = document.createElement('iframe');
        el.frameBorder = 'no';
        el.className = 'wtf-shim';
        if(Wtf.isIE && Wtf.isSecure){
            el.src = Wtf.SSL_SECURE_URL;
        }
        var shim = Wtf.get(this.dom.parentNode.insertBefore(el, this.dom));
        shim.autoBoxAdjust = false;
        return shim;
    },

    
    remove : function(){
        Wtf.removeNode(this.dom);
        delete El.cache[this.dom.id];
    },

    
    hover : function(overFn, outFn, scope){
        var preOverFn = function(e){
            if(!e.within(this, true)){
                overFn.apply(scope || this, arguments);
            }
        };
        var preOutFn = function(e){
            if(!e.within(this, true)){
                outFn.apply(scope || this, arguments);
            }
        };
        this.on("mouseover", preOverFn, this.dom);
        this.on("mouseout", preOutFn, this.dom);
        return this;
    },

    
    addClassOnOver : function(className, preventFlicker){
        this.hover(
            function(){
                Wtf.fly(this, '_internal').addClass(className);
            },
            function(){
                Wtf.fly(this, '_internal').removeClass(className);
            }
        );
        return this;
    },

    
    addClassOnFocus : function(className){
        this.on("focus", function(){
            Wtf.fly(this, '_internal').addClass(className);
        }, this.dom);
        this.on("blur", function(){
            Wtf.fly(this, '_internal').removeClass(className);
        }, this.dom);
        return this;
    },
    
    addClassOnClick : function(className){
        var dom = this.dom;
        this.on("mousedown", function(){
            Wtf.fly(dom, '_internal').addClass(className);
            var d = Wtf.getDoc();
            var fn = function(){
                Wtf.fly(dom, '_internal').removeClass(className);
                d.removeListener("mouseup", fn);
            };
            d.on("mouseup", fn);
        });
        return this;
    },

    
    swallowEvent : function(eventName, preventDefault){
        var fn = function(e){
            e.stopPropagation();
            if(preventDefault){
                e.preventDefault();
            }
        };
        if(eventName instanceof Array){
            for(var i = 0, len = eventName.length; i < len; i++){
                 this.on(eventName[i], fn);
            }
            return this;
        }
        this.on(eventName, fn);
        return this;
    },

    
    parent : function(selector, returnDom){
        return this.matchNode('parentNode', 'parentNode', selector, returnDom);
    },

     
    next : function(selector, returnDom){
        return this.matchNode('nextSibling', 'nextSibling', selector, returnDom);
    },

    
    prev : function(selector, returnDom){
        return this.matchNode('previousSibling', 'previousSibling', selector, returnDom);
    },


    
    first : function(selector, returnDom){
        return this.matchNode('nextSibling', 'firstChild', selector, returnDom);
    },

    
    last : function(selector, returnDom){
        return this.matchNode('previousSibling', 'lastChild', selector, returnDom);
    },

    matchNode : function(dir, start, selector, returnDom){
        var n = this.dom[start];
        while(n){
            if(n.nodeType == 1 && (!selector || Wtf.DomQuery.is(n, selector))){
                return !returnDom ? Wtf.get(n) : n;
            }
            n = n[dir];
        }
        return null;
    },

    
    appendChild: function(el){
        el = Wtf.get(el);
        el.appendTo(this);
        return this;
    },

    
    createChild: function(config, insertBefore, returnDom){
        config = config || {tag:'div'};
        if(insertBefore){
            return Wtf.DomHelper.insertBefore(insertBefore, config, returnDom !== true);
        }
        return Wtf.DomHelper[!this.dom.firstChild ? 'overwrite' : 'append'](this.dom, config,  returnDom !== true);
    },

    
    appendTo: function(el){
        el = Wtf.getDom(el);
        el.appendChild(this.dom);
        return this;
    },

    
    insertBefore: function(el){
        el = Wtf.getDom(el);
        el.parentNode.insertBefore(this.dom, el);
        return this;
    },

    
    insertAfter: function(el){
        el = Wtf.getDom(el);
        el.parentNode.insertBefore(this.dom, el.nextSibling);
        return this;
    },

    
    insertFirst: function(el, returnDom){
        el = el || {};
        if(typeof el == 'object' && !el.nodeType){ 
            return this.createChild(el, this.dom.firstChild, returnDom);
        }else{
            el = Wtf.getDom(el);
            this.dom.insertBefore(el, this.dom.firstChild);
            return !returnDom ? Wtf.get(el) : el;
        }
    },

    
    insertSibling: function(el, where, returnDom){
        var rt;
        if(el instanceof Array){
            for(var i = 0, len = el.length; i < len; i++){
                rt = this.insertSibling(el[i], where, returnDom);
            }
            return rt;
        }
        where = where ? where.toLowerCase() : 'before';
        el = el || {};
        var refNode = where == 'before' ? this.dom : this.dom.nextSibling;

        if(typeof el == 'object' && !el.nodeType){ 
            if(where == 'after' && !this.dom.nextSibling){
                rt = Wtf.DomHelper.append(this.dom.parentNode, el, !returnDom);
            }else{
                rt = Wtf.DomHelper[where == 'after' ? 'insertAfter' : 'insertBefore'](this.dom, el, !returnDom);
            }

        }else{
            rt = this.dom.parentNode.insertBefore(Wtf.getDom(el), refNode);
            if(!returnDom){
                rt = Wtf.get(rt);
            }
        }
        return rt;
    },

    
    wrap: function(config, returnDom){
        if(!config){
            config = {tag: "div"};
        }
        var newEl = Wtf.DomHelper.insertBefore(this.dom, config, !returnDom);
        newEl.dom ? newEl.dom.appendChild(this.dom) : newEl.appendChild(this.dom);
        return newEl;
    },

    
    replace: function(el){
        el = Wtf.get(el);
        this.insertBefore(el);
        el.remove();
        return this;
    },

    
    replaceWith: function(el){
        if(typeof el == 'object' && !el.nodeType){ 
            el = this.insertSibling(el, 'before');
        }else{
            el = Wtf.getDom(el);
            this.dom.parentNode.insertBefore(el, this.dom);
        }
        El.uncache(this.id);
        this.dom.parentNode.removeChild(this.dom);
        this.dom = el;
        this.id = Wtf.id(el);
        El.cache[this.id] = this;
        return this;
    },

    
    insertHtml : function(where, html, returnEl){
        var el = Wtf.DomHelper.insertHtml(where, this.dom, html);
        return returnEl ? Wtf.get(el) : el;
    },

    
    set : function(o, useSet){
        var el = this.dom;
        useSet = typeof useSet == 'undefined' ? (el.setAttribute ? true : false) : useSet;
        for(var attr in o){
            if(attr == "style" || typeof o[attr] == "function") continue;
            if(attr=="cls"){
                el.className = o["cls"];
            }else if(o.hasOwnProperty(attr)){
                if(useSet) el.setAttribute(attr, o[attr]);
                else el[attr] = o[attr];
            }
        }
        if(o.style){
            Wtf.DomHelper.applyStyles(el, o.style);
        }
        return this;
    },

    
    addKeyListener : function(key, fn, scope){
        var config;
        if(typeof key != "object" || key instanceof Array){
            config = {
                key: key,
                fn: fn,
                scope: scope
            };
        }else{
            config = {
                key : key.key,
                shift : key.shift,
                ctrl : key.ctrl,
                alt : key.alt,
                fn: fn,
                scope: scope
            };
        }
        return new Wtf.KeyMap(this, config);
    },

    
    addKeyMap : function(config){
        return new Wtf.KeyMap(this, config);
    },

    
     isScrollable : function(){
        var dom = this.dom;
        return dom.scrollHeight > dom.clientHeight || dom.scrollWidth > dom.clientWidth;
    },

    
    scrollTo : function(side, value, animate){
        var prop = side.toLowerCase() == "left" ? "scrollLeft" : "scrollTop";
        if(!animate || !A){
            this.dom[prop] = value;
        }else{
            var to = prop == "scrollLeft" ? [value, this.dom.scrollTop] : [this.dom.scrollLeft, value];
            this.anim({scroll: {"to": to}}, this.preanim(arguments, 2), 'scroll');
        }
        return this;
    },

    
     scroll : function(direction, distance, animate){
         if(!this.isScrollable()){
             return;
         }
         var el = this.dom;
         var l = el.scrollLeft, t = el.scrollTop;
         var w = el.scrollWidth, h = el.scrollHeight;
         var cw = el.clientWidth, ch = el.clientHeight;
         direction = direction.toLowerCase();
         var scrolled = false;
         var a = this.preanim(arguments, 2);
         switch(direction){
             case "l":
             case "left":
                 if(w - l > cw){
                     var v = Math.min(l + distance, w-cw);
                     this.scrollTo("left", v, a);
                     scrolled = true;
                 }
                 break;
            case "r":
            case "right":
                 if(l > 0){
                     var v = Math.max(l - distance, 0);
                     this.scrollTo("left", v, a);
                     scrolled = true;
                 }
                 break;
            case "t":
            case "top":
            case "up":
                 if(t > 0){
                     var v = Math.max(t - distance, 0);
                     this.scrollTo("top", v, a);
                     scrolled = true;
                 }
                 break;
            case "b":
            case "bottom":
            case "down":
                 if(h - t > ch){
                     var v = Math.min(t + distance, h-ch);
                     this.scrollTo("top", v, a);
                     scrolled = true;
                 }
                 break;
         }
         return scrolled;
    },

    
    translatePoints : function(x, y){
        if(typeof x == 'object' || x instanceof Array){
            y = x[1]; x = x[0];
        }
        var p = this.getStyle('position');
        var o = this.getXY();

        var l = parseInt(this.getStyle('left'), 10);
        var t = parseInt(this.getStyle('top'), 10);

        if(isNaN(l)){
            l = (p == "relative") ? 0 : this.dom.offsetLeft;
        }
        if(isNaN(t)){
            t = (p == "relative") ? 0 : this.dom.offsetTop;
        }

        return {left: (x - o[0] + l), top: (y - o[1] + t)};
    },

    
    getScroll : function(){
        var d = this.dom, doc = document;
        if(d == doc || d == doc.body){
            var l, t;
            if(Wtf.isIE && Wtf.isStrict){
                l = doc.documentElement.scrollLeft || (doc.body.scrollLeft || 0);
                t = doc.documentElement.scrollTop || (doc.body.scrollTop || 0);
            }else{
                l = window.pageXOffset || (doc.body.scrollLeft || 0);
                t = window.pageYOffset || (doc.body.scrollTop || 0);
            }
            return {left: l, top: t};
        }else{
            return {left: d.scrollLeft, top: d.scrollTop};
        }
    },

    
    getColor : function(attr, defaultValue, prefix){
        var v = this.getStyle(attr);
        if(!v || v == "transparent" || v == "inherit") {
            return defaultValue;
        }
        var color = typeof prefix == "undefined" ? "#" : prefix;
        if(v.substr(0, 4) == "rgb("){
            var rvs = v.slice(4, v.length -1).split(",");
            for(var i = 0; i < 3; i++){
                var h = parseInt(rvs[i]);
                var s = h.toString(16);
                if(h < 16){
                    s = "0" + s;
                }
                color += s;
            }
        } else {
            if(v.substr(0, 1) == "#"){
                if(v.length == 4) {
                    for(var i = 1; i < 4; i++){
                        var c = v.charAt(i);
                        color +=  c + c;
                    }
                }else if(v.length == 7){
                    color += v.substr(1);
                }
            }
        }
        return(color.length > 5 ? color.toLowerCase() : defaultValue);
    },

    
    boxWrap : function(cls){
        cls = cls || 'x-box';
        var el = Wtf.get(this.insertHtml('beforeBegin', String.format('<div class="{0}">'+El.boxMarkup+'</div>', cls)));
        el.child('.'+cls+'-mc').dom.appendChild(this.dom);
        return el;
    },

    
    getAttributeNS : Wtf.isIE ? function(ns, name){
        var d = this.dom;
        var type = typeof d[ns+":"+name];
        if(type != 'undefined' && type != 'unknown'){
            return d[ns+":"+name];
        }
        return d[name];
    } : function(ns, name){
        var d = this.dom;
        return d.getAttributeNS(ns, name) || d.getAttribute(ns+":"+name) || d.getAttribute(name) || d[name];
    },

    getTextWidth : function(text, min, max){
        return (Wtf.util.TextMetrics.measure(this.dom, Wtf.value(text, this.dom.innerHTML, true)).width).constrain(min || 0, max || 1000000);
    }
};

var ep = El.prototype;


ep.on = ep.addListener;
    
ep.mon = ep.addListener;

ep.getUpdateManager = ep.getUpdater;


ep.un = ep.removeListener;


ep.autoBoxAdjust = true;


El.unitPattern = /\d+(px|em|%|en|ex|pt|in|cm|mm|pc)$/i;


El.addUnits = function(v, defaultUnit){
    if(v === "" || v == "auto"){
        return v;
    }
    if(v === undefined){
        return '';
    }
    if(typeof v == "number" || !El.unitPattern.test(v)){
        return v + (defaultUnit || 'px');
    }
    return v;
};


El.boxMarkup = '<div class="{0}-tl"><div class="{0}-tr"><div class="{0}-tc"></div></div></div><div class="{0}-ml"><div class="{0}-mr"><div class="{0}-mc"></div></div></div><div class="{0}-bl"><div class="{0}-br"><div class="{0}-bc"></div></div></div>';

El.VISIBILITY = 1;

El.DISPLAY = 2;

El.borders = {l: "border-left-width", r: "border-right-width", t: "border-top-width", b: "border-bottom-width"};
El.paddings = {l: "padding-left", r: "padding-right", t: "padding-top", b: "padding-bottom"};
El.margins = {l: "margin-left", r: "margin-right", t: "margin-top", b: "margin-bottom"};




El.cache = {};

var docEl;


El.get = function(el){
    var ex, elm, id;
    if(!el){ return null; }
    if(typeof el == "string"){ 
        if(!(elm = document.getElementById(el))){
            return null;
        }
        if(ex = El.cache[el]){
            ex.dom = elm;
        }else{
            ex = El.cache[el] = new El(elm);
        }
        return ex;
    }else if(el.tagName){ 
        if(!(id = el.id)){
            id = Wtf.id(el);
        }
        if(ex = El.cache[id]){
            ex.dom = el;
        }else{
            ex = El.cache[id] = new El(el);
        }
        return ex;
    }else if(el instanceof El){
        if(el != docEl){
            el.dom = document.getElementById(el.id) || el.dom; 
                                                          
            El.cache[el.id] = el; 
        }
        return el;
    }else if(el.isComposite){
        return el;
    }else if(el instanceof Array){
        return El.select(el);
    }else if(el == document){
        
        if(!docEl){
            var f = function(){};
            f.prototype = El.prototype;
            docEl = new f();
            docEl.dom = document;
        }
        return docEl;
    }
    return null;
};


El.uncache = function(el){
    for(var i = 0, a = arguments, len = a.length; i < len; i++) {
        if(a[i]){
            delete El.cache[a[i].id || a[i]];
        }
    }
};




El.garbageCollect = function(){
    if(!Wtf.enableGarbageCollector){
        clearInterval(El.collectorThread);
        return;
    }
    for(var eid in El.cache){
        var el = El.cache[eid], d = el.dom;
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        if(!d || !d.parentNode || (!d.offsetParent && !document.getElementById(eid))){
            delete El.cache[eid];
            if(d && Wtf.enableListenerCollection){
                E.purgeElement(d);
            }
        }
    }
}
El.collectorThreadId = setInterval(El.garbageCollect, 30000);

var flyFn = function(){};
flyFn.prototype = El.prototype;
var _cls = new flyFn();


El.Flyweight = function(dom){
    this.dom = dom;
};

El.Flyweight.prototype = _cls;
El.Flyweight.prototype.isFlyweight = true;

El._flyweights = {};

El.fly = function(el, named){
    named = named || '_global';
    el = Wtf.getDom(el);
    if(!el){
        return null;
    }
    if(!El._flyweights[named]){
        El._flyweights[named] = new El.Flyweight();
    }
    El._flyweights[named].dom = el;
    return El._flyweights[named];
};


Wtf.get = El.get;

Wtf.fly = El.fly;


var noBoxAdjust = Wtf.isStrict ? {
    select:1
} : {
    input:1, select:1, textarea:1
};
if(Wtf.isIE || Wtf.isGecko){
    noBoxAdjust['button'] = 1;
}


Wtf.EventManager.on(window, 'unload', function(){
    delete El.cache;
    delete El._flyweights;
});
})();

Wtf.enableFx = true;


Wtf.Fx = {
	
    slideIn : function(anchor, o){
        var el = this.getFxEl();
        o = o || {};

        el.queueFx(o, function(){

            anchor = anchor || "t";

                        this.fixDisplay();

                        var r = this.getFxRestore();
            var b = this.getBox();
                        this.setSize(b);

                        var wrap = this.fxWrap(r.pos, o, "hidden");

            var st = this.dom.style;
            st.visibility = "visible";
            st.position = "absolute";

                        var after = function(){
                el.fxUnwrap(wrap, r.pos, o);
                st.width = r.width;
                st.height = r.height;
                el.afterFx(o);
            };
                        var a, pt = {to: [b.x, b.y]}, bw = {to: b.width}, bh = {to: b.height};

            switch(anchor.toLowerCase()){
                case "t":
                    wrap.setSize(b.width, 0);
                    st.left = st.bottom = "0";
                    a = {height: bh};
                break;
                case "l":
                    wrap.setSize(0, b.height);
                    st.right = st.top = "0";
                    a = {width: bw};
                break;
                case "r":
                    wrap.setSize(0, b.height);
                    wrap.setX(b.right);
                    st.left = st.top = "0";
                    a = {width: bw, points: pt};
                break;
                case "b":
                    wrap.setSize(b.width, 0);
                    wrap.setY(b.bottom);
                    st.left = st.top = "0";
                    a = {height: bh, points: pt};
                break;
                case "tl":
                    wrap.setSize(0, 0);
                    st.right = st.bottom = "0";
                    a = {width: bw, height: bh};
                break;
                case "bl":
                    wrap.setSize(0, 0);
                    wrap.setY(b.y+b.height);
                    st.right = st.top = "0";
                    a = {width: bw, height: bh, points: pt};
                break;
                case "br":
                    wrap.setSize(0, 0);
                    wrap.setXY([b.right, b.bottom]);
                    st.left = st.top = "0";
                    a = {width: bw, height: bh, points: pt};
                break;
                case "tr":
                    wrap.setSize(0, 0);
                    wrap.setX(b.x+b.width);
                    st.left = st.bottom = "0";
                    a = {width: bw, height: bh, points: pt};
                break;
            }
            this.dom.style.visibility = "visible";
            wrap.show();

            arguments.callee.anim = wrap.fxanim(a,
                o,
                'motion',
                .5,
                'easeOut', after);
        });
        return this;
    },
    
	
    slideOut : function(anchor, o){
        var el = this.getFxEl();
        o = o || {};

        el.queueFx(o, function(){

            anchor = anchor || "t";

                        var r = this.getFxRestore();
            
            var b = this.getBox();
                        this.setSize(b);

                        var wrap = this.fxWrap(r.pos, o, "visible");

            var st = this.dom.style;
            st.visibility = "visible";
            st.position = "absolute";

            wrap.setSize(b);

            var after = function(){
                if(o.useDisplay){
                    el.setDisplayed(false);
                }else{
                    el.hide();
                }

                el.fxUnwrap(wrap, r.pos, o);

                st.width = r.width;
                st.height = r.height;

                el.afterFx(o);
            };

            var a, zero = {to: 0};
            switch(anchor.toLowerCase()){
                case "t":
                    st.left = st.bottom = "0";
                    a = {height: zero};
                break;
                case "l":
                    st.right = st.top = "0";
                    a = {width: zero};
                break;
                case "r":
                    st.left = st.top = "0";
                    a = {width: zero, points: {to:[b.right, b.y]}};
                break;
                case "b":
                    st.left = st.top = "0";
                    a = {height: zero, points: {to:[b.x, b.bottom]}};
                break;
                case "tl":
                    st.right = st.bottom = "0";
                    a = {width: zero, height: zero};
                break;
                case "bl":
                    st.right = st.top = "0";
                    a = {width: zero, height: zero, points: {to:[b.x, b.bottom]}};
                break;
                case "br":
                    st.left = st.top = "0";
                    a = {width: zero, height: zero, points: {to:[b.x+b.width, b.bottom]}};
                break;
                case "tr":
                    st.left = st.bottom = "0";
                    a = {width: zero, height: zero, points: {to:[b.right, b.y]}};
                break;
            }

            arguments.callee.anim = wrap.fxanim(a,
                o,
                'motion',
                .5,
                "easeOut", after);
        });
        return this;
    },

	
    puff : function(o){
        var el = this.getFxEl();
        o = o || {};

        el.queueFx(o, function(){
            this.clearOpacity();
            this.show();

                        var r = this.getFxRestore();
            var st = this.dom.style;

            var after = function(){
                if(o.useDisplay){
                    el.setDisplayed(false);
                }else{
                    el.hide();
                }

                el.clearOpacity();

                el.setPositioning(r.pos);
                st.width = r.width;
                st.height = r.height;
                st.fontSize = '';
                el.afterFx(o);
            };

            var width = this.getWidth();
            var height = this.getHeight();

            arguments.callee.anim = this.fxanim({
                    width : {to: this.adjustWidth(width * 2)},
                    height : {to: this.adjustHeight(height * 2)},
                    points : {by: [-(width * .5), -(height * .5)]},
                    opacity : {to: 0},
                    fontSize: {to:200, unit: "%"}
                },
                o,
                'motion',
                .5,
                "easeOut", after);
        });
        return this;
    },

	
    switchOff : function(o){
        var el = this.getFxEl();
        o = o || {};

        el.queueFx(o, function(){
            this.clearOpacity();
            this.clip();

                        var r = this.getFxRestore();
            var st = this.dom.style;

            var after = function(){
                if(o.useDisplay){
                    el.setDisplayed(false);
                }else{
                    el.hide();
                }

                el.clearOpacity();
                el.setPositioning(r.pos);
                st.width = r.width;
                st.height = r.height;

                el.afterFx(o);
            };

            this.fxanim({opacity:{to:0.3}}, null, null, .1, null, function(){
                this.clearOpacity();
                (function(){
                    this.fxanim({
                        height:{to:1},
                        points:{by:[0, this.getHeight() * .5]}
                    }, o, 'motion', 0.3, 'easeIn', after);
                }).defer(100, this);
            });
        });
        return this;
    },

    	
    highlight : function(color, o){
        var el = this.getFxEl();
        o = o || {};

        el.queueFx(o, function(){
            color = color || "ffff9c";
            var attr = o.attr || "backgroundColor";

            this.clearOpacity();
            this.show();

            var origColor = this.getColor(attr);
            var restoreColor = this.dom.style[attr];
            var endColor = (o.endColor || origColor) || "ffffff";

            var after = function(){
                el.dom.style[attr] = restoreColor;
                el.afterFx(o);
            };

            var a = {};
            a[attr] = {from: color, to: endColor};
            arguments.callee.anim = this.fxanim(a,
                o,
                'color',
                1,
                'easeIn', after);
        });
        return this;
    },

   
    frame : function(color, count, o){
        var el = this.getFxEl();
        o = o || {};

        el.queueFx(o, function(){
            color = color || "#C3DAF9";
            if(color.length == 6){
                color = "#" + color;
            }
            count = count || 1;
            var duration = o.duration || 1;
            this.show();

            var b = this.getBox();
            var animFn = function(){
                var proxy = Wtf.getBody().createChild({
                     style:{
                        visbility:"hidden",
                        position:"absolute",
                        "z-index":"35000",                         border:"0px solid " + color
                     }
                  });
                var scale = Wtf.isBorderBox ? 2 : 1;
                proxy.animate({
                    top:{from:b.y, to:b.y - 20},
                    left:{from:b.x, to:b.x - 20},
                    borderWidth:{from:0, to:10},
                    opacity:{from:1, to:0},
                    height:{from:b.height, to:(b.height + (20*scale))},
                    width:{from:b.width, to:(b.width + (20*scale))}
                }, duration, function(){
                    proxy.remove();
                    if(--count > 0){
                         animFn();
                    }else{
                        el.afterFx(o);
                    }
                });
            };
            animFn.call(this);
        });
        return this;
    },

   
    pause : function(seconds){
        var el = this.getFxEl();
        var o = {};

        el.queueFx(o, function(){
            setTimeout(function(){
                el.afterFx(o);
            }, seconds * 1000);
        });
        return this;
    },

   
    fadeIn : function(o){
        var el = this.getFxEl();
        o = o || {};
        el.queueFx(o, function(){
            this.setOpacity(0);
            this.fixDisplay();
            this.dom.style.visibility = 'visible';
            var to = o.endOpacity || 1;
            arguments.callee.anim = this.fxanim({opacity:{to:to}},
                o, null, .5, "easeOut", function(){
                if(to == 1){
                    this.clearOpacity();
                }
                el.afterFx(o);
            });
        });
        return this;
    },

   
    fadeOut : function(o){
        var el = this.getFxEl();
        o = o || {};
        el.queueFx(o, function(){
            arguments.callee.anim = this.fxanim({opacity:{to:o.endOpacity || 0}},
                o, null, .5, "easeOut", function(){
                if(this.visibilityMode == Wtf.Element.DISPLAY || o.useDisplay){
                     this.dom.style.display = "none";
                }else{
                     this.dom.style.visibility = "hidden";
                }
                this.clearOpacity();
                el.afterFx(o);
            });
        });
        return this;
    },

   
    scale : function(w, h, o){
        this.shift(Wtf.apply({}, o, {
            width: w,
            height: h
        }));
        return this;
    },

   
    shift : function(o){
        var el = this.getFxEl();
        o = o || {};
        el.queueFx(o, function(){
            var a = {}, w = o.width, h = o.height, x = o.x, y = o.y,  op = o.opacity;
            if(w !== undefined){
                a.width = {to: this.adjustWidth(w)};
            }
            if(h !== undefined){
                a.height = {to: this.adjustHeight(h)};
            }
            if(x !== undefined || y !== undefined){
                a.points = {to: [
                    x !== undefined ? x : this.getX(),
                    y !== undefined ? y : this.getY()
                ]};
            }
            if(op !== undefined){
                a.opacity = {to: op};
            }
            if(o.xy !== undefined){
                a.points = {to: o.xy};
            }
            arguments.callee.anim = this.fxanim(a,
                o, 'motion', .35, "easeOut", function(){
                el.afterFx(o);
            });
        });
        return this;
    },

	
    ghost : function(anchor, o){
        var el = this.getFxEl();
        o = o || {};

        el.queueFx(o, function(){
            anchor = anchor || "b";

                        var r = this.getFxRestore();
            var w = this.getWidth(),
                h = this.getHeight();

            var st = this.dom.style;

            var after = function(){
                if(o.useDisplay){
                    el.setDisplayed(false);
                }else{
                    el.hide();
                }

                el.clearOpacity();
                el.setPositioning(r.pos);
                st.width = r.width;
                st.height = r.height;

                el.afterFx(o);
            };

            var a = {opacity: {to: 0}, points: {}}, pt = a.points;
            switch(anchor.toLowerCase()){
                case "t":
                    pt.by = [0, -h];
                break;
                case "l":
                    pt.by = [-w, 0];
                break;
                case "r":
                    pt.by = [w, 0];
                break;
                case "b":
                    pt.by = [0, h];
                break;
                case "tl":
                    pt.by = [-w, -h];
                break;
                case "bl":
                    pt.by = [-w, h];
                break;
                case "br":
                    pt.by = [w, h];
                break;
                case "tr":
                    pt.by = [w, -h];
                break;
            }

            arguments.callee.anim = this.fxanim(a,
                o,
                'motion',
                .5,
                "easeOut", after);
        });
        return this;
    },

	
    syncFx : function(){
        this.fxDefaults = Wtf.apply(this.fxDefaults || {}, {
            block : false,
            concurrent : true,
            stopFx : false
        });
        return this;
    },

	
    sequenceFx : function(){
        this.fxDefaults = Wtf.apply(this.fxDefaults || {}, {
            block : false,
            concurrent : false,
            stopFx : false
        });
        return this;
    },

	
    nextFx : function(){
        var ef = this.fxQueue[0];
        if(ef){
            ef.call(this);
        }
    },

	
    hasActiveFx : function(){
        return this.fxQueue && this.fxQueue[0];
    },

	
    stopFx : function(){
        if(this.hasActiveFx()){
            var cur = this.fxQueue[0];
            if(cur && cur.anim && cur.anim.isAnimated()){
                this.fxQueue = [cur];                 cur.anim.stop(true);
            }
        }
        return this;
    },

	
    beforeFx : function(o){
        if(this.hasActiveFx() && !o.concurrent){
           if(o.stopFx){
               this.stopFx();
               return true;
           }
           return false;
        }
        return true;
    },

	
    hasFxBlock : function(){
        var q = this.fxQueue;
        return q && q[0] && q[0].block;
    },

	
    queueFx : function(o, fn){
        if(!this.fxQueue){
            this.fxQueue = [];
        }
        if(!this.hasFxBlock()){
            Wtf.applyIf(o, this.fxDefaults);
            if(!o.concurrent){
                var run = this.beforeFx(o);
                fn.block = o.block;
                this.fxQueue.push(fn);
                if(run){
                    this.nextFx();
                }
            }else{
                fn.call(this);
            }
        }
        return this;
    },

	
    fxWrap : function(pos, o, vis){
        var wrap;
        if(!o.wrap || !(wrap = Wtf.get(o.wrap))){
            var wrapXY;
            if(o.fixPosition){
                wrapXY = this.getXY();
            }
            var div = document.createElement("div");
            div.style.visibility = vis;
            wrap = Wtf.get(this.dom.parentNode.insertBefore(div, this.dom));
            wrap.setPositioning(pos);
            if(wrap.getStyle("position") == "static"){
                wrap.position("relative");
            }
            this.clearPositioning('auto');
            wrap.clip();
            wrap.dom.appendChild(this.dom);
            if(wrapXY){
                wrap.setXY(wrapXY);
            }
        }
        return wrap;
    },

	
    fxUnwrap : function(wrap, pos, o){
        this.clearPositioning();
        this.setPositioning(pos);
        if(!o.wrap){
            wrap.dom.parentNode.insertBefore(this.dom, wrap.dom);
            wrap.remove();
        }
    },

	
    getFxRestore : function(){
        var st = this.dom.style;
        return {pos: this.getPositioning(), width: st.width, height : st.height};
    },

	
    afterFx : function(o){
        if(o.afterStyle){
            this.applyStyles(o.afterStyle);
        }
        if(o.afterCls){
            this.addClass(o.afterCls);
        }
        if(o.remove === true){
            this.remove();
        }
        Wtf.callback(o.callback, o.scope, [this]);
        if(!o.concurrent){
            this.fxQueue.shift();
            this.nextFx();
        }
    },

	
    getFxEl : function(){         return Wtf.get(this.dom);
    },

	
    fxanim : function(args, opt, animType, defaultDur, defaultEase, cb){
        animType = animType || 'run';
        opt = opt || {};
        var anim = Wtf.lib.Anim[animType](
            this.dom, args,
            (opt.duration || defaultDur) || .35,
            (opt.easing || defaultEase) || 'easeOut',
            function(){
                Wtf.callback(cb, this);
            },
            this
        );
        opt.anim = anim;
        return anim;
    }
};

Wtf.Fx.resize = Wtf.Fx.scale;

Wtf.apply(Wtf.Element.prototype, Wtf.Fx);


Wtf.CompositeElement = function(els){
    this.elements = [];
    this.addElements(els);
};
Wtf.CompositeElement.prototype = {
    isComposite: true,
    addElements : function(els){
        if(!els) return this;
        if(typeof els == "string"){
            els = Wtf.Element.selectorFunction(els);
        }
        var yels = this.elements;
        var index = yels.length-1;
        for(var i = 0, len = els.length; i < len; i++) {
        	yels[++index] = Wtf.get(els[i]);
        }
        return this;
    },

    
    fill : function(els){
        this.elements = [];
        this.add(els);
        return this;
    },

    
    filter : function(selector){
        var els = [];
        this.each(function(el){
            if(el.is(selector)){
                els[els.length] = el.dom;
            }
        });
        this.fill(els);
        return this;
    },

    invoke : function(fn, args){
        var els = this.elements;
        for(var i = 0, len = els.length; i < len; i++) {
        	Wtf.Element.prototype[fn].apply(els[i], args);
        }
        return this;
    },
    
    add : function(els){
        if(typeof els == "string"){
            this.addElements(Wtf.Element.selectorFunction(els));
        }else if(els.length !== undefined){
            this.addElements(els);
        }else{
            this.addElements([els]);
        }
        return this;
    },
    
    each : function(fn, scope){
        var els = this.elements;
        for(var i = 0, len = els.length; i < len; i++){
            if(fn.call(scope || els[i], els[i], this, i) === false) {
                break;
            }
        }
        return this;
    },

    
    item : function(index){
        return this.elements[index] || null;
    },

    
    first : function(){
        return this.item(0);
    },

    
    last : function(){
        return this.item(this.elements.length-1);
    },

    
    getCount : function(){
        return this.elements.length;
    },

    
    contains : function(el){
        return this.indexOf(el) !== -1;
    },

    
    indexOf : function(el){
        return this.elements.indexOf(Wtf.get(el));
    },


    
    removeElement : function(el, removeDom){
        if(el instanceof Array){
            for(var i = 0, len = el.length; i < len; i++){
                this.removeElement(el[i]);
            }
            return this;
        }
        var index = typeof el == 'number' ? el : this.indexOf(el);
        if(index !== -1 && this.elements[index]){
            if(removeDom){
                var d = this.elements[index];
                if(d.dom){
                    d.remove();
                }else{
                    Wtf.removeNode(d);
                }
            }
            this.elements.splice(index, 1);
        }
        return this;
    },

    
    replaceElement : function(el, replacement, domReplace){
        var index = typeof el == 'number' ? el : this.indexOf(el);
        if(index !== -1){
            if(domReplace){
                this.elements[index].replaceWith(replacement);
            }else{
                this.elements.splice(index, 1, Wtf.get(replacement))
            }
        }
        return this;
    },

    
    clear : function(){
        this.elements = [];
    }
};
(function(){
Wtf.CompositeElement.createCall = function(proto, fnName){
    if(!proto[fnName]){
        proto[fnName] = function(){
            return this.invoke(fnName, arguments);
        };
    }
};
for(var fnName in Wtf.Element.prototype){
    if(typeof Wtf.Element.prototype[fnName] == "function"){
        Wtf.CompositeElement.createCall(Wtf.CompositeElement.prototype, fnName);
    }
};
})();


Wtf.CompositeElementLite = function(els){
    Wtf.CompositeElementLite.superclass.constructor.call(this, els);
    this.el = new Wtf.Element.Flyweight();
};
Wtf.extend(Wtf.CompositeElementLite, Wtf.CompositeElement, {
    addElements : function(els){
        if(els){
            if(els instanceof Array){
                this.elements = this.elements.concat(els);
            }else{
                var yels = this.elements;
                var index = yels.length-1;
                for(var i = 0, len = els.length; i < len; i++) {
                    yels[++index] = els[i];
                }
            }
        }
        return this;
    },
    invoke : function(fn, args){
        var els = this.elements;
        var el = this.el;
        for(var i = 0, len = els.length; i < len; i++) {
            el.dom = els[i];
        	Wtf.Element.prototype[fn].apply(el, args);
        }
        return this;
    },
    
    item : function(index){
        if(!this.elements[index]){
            return null;
        }
        this.el.dom = this.elements[index];
        return this.el;
    },

    
    addListener : function(eventName, handler, scope, opt){
        var els = this.elements;
        for(var i = 0, len = els.length; i < len; i++) {
            Wtf.EventManager.on(els[i], eventName, handler, scope || els[i], opt);
        }
        return this;
    },

    
    each : function(fn, scope){
        var els = this.elements;
        var el = this.el;
        for(var i = 0, len = els.length; i < len; i++){
            el.dom = els[i];
        	if(fn.call(scope || el, el, this, i) === false){
                break;
            }
        }
        return this;
    },

    indexOf : function(el){
        return this.elements.indexOf(Wtf.getDom(el));
    },

    replaceElement : function(el, replacement, domReplace){
        var index = typeof el == 'number' ? el : this.indexOf(el);
        if(index !== -1){
            replacement = Wtf.getDom(replacement);
            if(domReplace){
                var d = this.elements[index];
                d.parentNode.insertBefore(replacement, d);
                Wtf.removeNode(d);
            }
            this.elements.splice(index, 1, replacement);
        }
        return this;
    }
});
Wtf.CompositeElementLite.prototype.on = Wtf.CompositeElementLite.prototype.addListener;
if(Wtf.DomQuery){
    Wtf.Element.selectorFunction = Wtf.DomQuery.select;
}

Wtf.Element.select = function(selector, unique, root){
    var els;
    if(typeof selector == "string"){
        els = Wtf.Element.selectorFunction(selector, root);
    }else if(selector.length !== undefined){
        els = selector;
    }else{
        throw "Invalid selector";
    }
    if(unique === true){
        return new Wtf.CompositeElement(els);
    }else{
        return new Wtf.CompositeElementLite(els);
    }
};

Wtf.select = Wtf.Element.select;

Wtf.data.Connection = function(config){
    Wtf.apply(this, config);
    this.addEvents(
        
        "beforerequest",
        
        "requestcomplete",
        
        "requestexception"
    );
    Wtf.data.Connection.superclass.constructor.call(this);
};

Wtf.extend(Wtf.data.Connection, Wtf.util.Observable, {
    
    
    
    
    
    timeout : 30000,
    
    autoAbort:false,

    
    disableCaching: true,

    
    request : function(o){
        if(this.fireEvent("beforerequest", this, o) !== false){
            var p = o.params;

            if(typeof p == "function"){
                p = p.call(o.scope||window, o);
            }
            if(typeof p == "object"){
                p = Wtf.urlEncode(p);
            }
            if(this.extraParams){
                var extras = Wtf.urlEncode(this.extraParams);
                p = p ? (p + '&' + extras) : extras;
            }

            var url = o.url || this.url;
            if(typeof url == 'function'){
                url = url.call(o.scope||window, o);
            }

            if(o.form){
                var form = Wtf.getDom(o.form);
                url = url || form.action;

                var enctype = form.getAttribute("enctype");
                if(o.isUpload || (enctype && enctype.toLowerCase() == 'multipart/form-data')){
                    return this.doFormUpload(o, p, url);
                }
                var f = Wtf.lib.Ajax.serializeForm(form);
                p = p ? (p + '&' + f) : f;
            }

            var hs = o.headers;
            if(this.defaultHeaders){
                hs = Wtf.apply(hs || {}, this.defaultHeaders);
                if(!o.headers){
                    o.headers = hs;
                }
            }

            var cb = {
                success: this.handleResponse,
                failure: this.handleFailure,
                scope: this,
                argument: {options: o},
                timeout : this.timeout
            };

            var method = o.method||this.method||(p ? "POST" : "GET");

            if(method == 'GET' && (this.disableCaching && o.disableCaching !== false) || o.disableCaching === true){
                url += (url.indexOf('?') != -1 ? '&' : '?') + '_dc=' + (new Date().getTime());
            }

            if(typeof o.autoAbort == 'boolean'){ 
                if(o.autoAbort){
                    this.abort();
                }
            }else if(this.autoAbort !== false){
                this.abort();
            }
            if((method == 'GET' && p) || o.xmlData || o.jsonData){
                url += (url.indexOf('?') != -1 ? '&' : '?') + p;
                p = '';
            }
            this.transId = Wtf.lib.Ajax.request(method, url, cb, p, o);
            return this.transId;
        }else{
            Wtf.callback(o.callback, o.scope, [o, null, null]);
            return null;
        }
    },

    
    isLoading : function(transId){
        if(transId){
            return Wtf.lib.Ajax.isCallInProgress(transId);
        }else{
            return this.transId ? true : false;
        }
    },

    
    abort : function(transId){
        if(transId || this.isLoading()){
            Wtf.lib.Ajax.abort(transId || this.transId);
        }
    },

    
    handleResponse : function(response){
        this.transId = false;
        var options = response.argument.options;
        response.argument = options ? options.argument : null;
        this.fireEvent("requestcomplete", this, response, options);
        Wtf.callback(options.success, options.scope, [response, options]);
        Wtf.callback(options.callback, options.scope, [options, true, response]);
    },

    
    handleFailure : function(response, e){
        this.transId = false;
        var options = response.argument.options;
        response.argument = options ? options.argument : null;
        this.fireEvent("requestexception", this, response, options, e);
        Wtf.callback(options.failure, options.scope, [response, options]);
        Wtf.callback(options.callback, options.scope, [options, false, response]);
    },

    
    doFormUpload : function(o, ps, url){
        var id = Wtf.id();
        var frame = document.createElement('iframe');
        frame.id = id;
        frame.name = id;
        frame.className = 'x-hidden';
        if(Wtf.isIE){
            frame.src = Wtf.SSL_SECURE_URL;
        }
        document.body.appendChild(frame);

        if(Wtf.isIE){
           document.frames[id].name = id;
        }

        var form = Wtf.getDom(o.form);
        form.target = id;
        form.method = 'POST';
        form.enctype = form.encoding = 'multipart/form-data';
        if(url){
            form.action = url;
        }

        var hiddens, hd;
        if(ps){ 
            hiddens = [];
            ps = Wtf.urlDecode(ps, false);
            for(var k in ps){
                if(ps.hasOwnProperty(k)){
                    hd = document.createElement('input');
                    hd.type = 'hidden';
                    hd.name = k;
                    hd.value = ps[k];
                    form.appendChild(hd);
                    hiddens.push(hd);
                }
            }
        }

        function cb(){
            var r = {  
                responseText : '',
                responseXML : null
            };

            r.argument = o ? o.argument : null;

            try { 
                var doc;
                if(Wtf.isIE){
                    doc = frame.contentWindow.document;
                }else {
                    doc = (frame.contentDocument || window.frames[id].document);
                }
                if(doc && doc.body){
                    r.responseText = doc.body.innerHTML;
                }
                if(doc && doc.XMLDocument){
                    r.responseXML = doc.XMLDocument;
                }else {
                    r.responseXML = doc;
                }
            }
            catch(e) {
                
            }

            Wtf.EventManager.removeListener(frame, 'load', cb, this);

            this.fireEvent("requestcomplete", this, r, o);

            Wtf.callback(o.success, o.scope, [r, o]);
            Wtf.callback(o.callback, o.scope, [o, true, r]);

            setTimeout(function(){Wtf.removeNode(frame);}, 100);
        }

        Wtf.EventManager.on(frame, 'load', cb, this);
        form.submit();

        if(hiddens){ 
            for(var i = 0, len = hiddens.length; i < len; i++){
                Wtf.removeNode(hiddens[i]);
            }
        }
    }
});


Wtf.Ajax = new Wtf.data.Connection({
    
    
    
    
    
    

    

    
    
    
    
    
    

    
    autoAbort : false,

    
    serializeForm : function(form){
        return Wtf.lib.Ajax.serializeForm(form);
    }
});

Wtf.Updater = function(el, forceNew){
    el = Wtf.get(el);
    if(!forceNew && el.updateManager){
        return el.updateManager;
    }
    
    this.el = el;
    
    this.defaultUrl = null;

    this.addEvents(
        
        "beforeupdate",
        
        "update",
        
        "failure"
    );
    var d = Wtf.Updater.defaults;
    
    this.sslBlankUrl = d.sslBlankUrl;
    
    this.disableCaching = d.disableCaching;
    
    this.indicatorText = d.indicatorText;
    
    this.showLoadIndicator = d.showLoadIndicator;
    
    this.timeout = d.timeout;

    
    this.loadScripts = d.loadScripts;

    
    this.transaction = null;

    
    this.autoRefreshProcId = null;
    
    this.refreshDelegate = this.refresh.createDelegate(this);
    
    this.updateDelegate = this.update.createDelegate(this);
    
    this.formUpdateDelegate = this.formUpdate.createDelegate(this);

    if(!this.renderer){
     
    this.renderer = new Wtf.Updater.BasicRenderer();
    }
    Wtf.Updater.superclass.constructor.call(this);
};

Wtf.extend(Wtf.Updater, Wtf.util.Observable, {
    
    getEl : function(){
        return this.el;
    },
    
    update : function(url, params, callback, discardUrl){
        if(this.fireEvent("beforeupdate", this.el, url, params) !== false){
            var method = this.method, cfg, callerScope;
            if(typeof url == "object"){ 
                cfg = url;
                url = cfg.url;
                params = params || cfg.params;
                callback = callback || cfg.callback;
                discardUrl = discardUrl || cfg.discardUrl;
	            callerScope = cfg.scope;
                if(typeof cfg.method != "undefined"){method = cfg.method;};
                if(typeof cfg.nocache != "undefined"){this.disableCaching = cfg.nocache;};
                if(typeof cfg.text != "undefined"){this.indicatorText = '<div class="loading-indicator">'+cfg.text+"</div>";};
                if(typeof cfg.scripts != "undefined"){this.loadScripts = cfg.scripts;};
                if(typeof cfg.timeout != "undefined"){this.timeout = cfg.timeout;};
            }
            this.showLoading();
            if(!discardUrl){
                this.defaultUrl = url;
            }
            if(typeof url == "function"){
                url = url.call(this);
            }

            method = method || (params ? "POST" : "GET");
            if(method == "GET"){
                url = this.prepareUrl(url);
            }

            var o = Wtf.apply(cfg ||{}, {
                url : url,
                params: (typeof params == "function" && callerScope) ? params.createDelegate(callerScope) : params,
                success: this.processSuccess,
                failure: this.processFailure,
                scope: this,
                callback: undefined,
                timeout: (this.timeout*1000),
                argument: {
                	"options": cfg,
                	"url": url,
                	"form": null,
                	"callback": callback,
                	"scope": callerScope || window,
                	"params": params
                }
            });

            this.transaction = Wtf.Ajax.request(o);
        }
    },

    
    formUpdate : function(form, url, reset, callback){
        if(this.fireEvent("beforeupdate", this.el, form, url) !== false){
            if(typeof url == "function"){
                url = url.call(this);
            }
            form = Wtf.getDom(form)
            this.transaction = Wtf.Ajax.request({
                form: form,
                url:url,
                success: this.processSuccess,
                failure: this.processFailure,
                scope: this,
                timeout: (this.timeout*1000),
                argument: {
                	"url": url,
                	"form": form,
                	"callback": callback,
                	"reset": reset
                }
            });
            this.showLoading.defer(1, this);
        }
    },

    
    refresh : function(callback){
        if(this.defaultUrl == null){
            return;
        }
        this.update(this.defaultUrl, null, callback, true);
    },

    
    startAutoRefresh : function(interval, url, params, callback, refreshNow){
        if(refreshNow){
            this.update(url || this.defaultUrl, params, callback, true);
        }
        if(this.autoRefreshProcId){
            clearInterval(this.autoRefreshProcId);
        }
        this.autoRefreshProcId = setInterval(this.update.createDelegate(this, [url || this.defaultUrl, params, callback, true]), interval*1000);
    },

    
     stopAutoRefresh : function(){
        if(this.autoRefreshProcId){
            clearInterval(this.autoRefreshProcId);
            delete this.autoRefreshProcId;
        }
    },

    isAutoRefreshing : function(){
       return this.autoRefreshProcId ? true : false;
    },
    
    showLoading : function(){
        if(this.showLoadIndicator){
            this.el.update(this.indicatorText);
        }
    },

    
    prepareUrl : function(url){
        if(this.disableCaching){
            var append = "_dc=" + (new Date().getTime());
            if(url.indexOf("?") !== -1){
                url += "&" + append;
            }else{
                url += "?" + append;
            }
        }
        return url;
    },

    
    processSuccess : function(response){
        this.transaction = null;
        if(response.argument.form && response.argument.reset){
            try{ 
                response.argument.form.reset();
            }catch(e){}
        }
        if(this.loadScripts){
            this.renderer.render(this.el, response, this,
                this.updateComplete.createDelegate(this, [response]));
        }else{
            this.renderer.render(this.el, response, this);
            this.updateComplete(response);
        }
    },

    updateComplete : function(response){
        this.fireEvent("update", this.el, response);
        if(typeof response.argument.callback == "function"){
            response.argument.callback.call(response.argument.scope, this.el, true, response, response.argument.options);
        }
    },

    
    processFailure : function(response){
        this.transaction = null;
        this.fireEvent("failure", this.el, response);
        if(typeof response.argument.callback == "function"){
            response.argument.callback.call(response.argument.scope, this.el, false, response, response.argument.options);
        }
    },

    
    setRenderer : function(renderer){
        this.renderer = renderer;
    },

    getRenderer : function(){
       return this.renderer;
    },

    
    setDefaultUrl : function(defaultUrl){
        this.defaultUrl = defaultUrl;
    },

    
    abort : function(){
        if(this.transaction){
            Wtf.Ajax.abort(this.transaction);
        }
    },

    
    isUpdating : function(){
        if(this.transaction){
            return Wtf.Ajax.isLoading(this.transaction);
        }
        return false;
    }
});


   Wtf.Updater.defaults = {
       
         timeout : 30,

         
        loadScripts : false,

        
        sslBlankUrl : (Wtf.SSL_SECURE_URL || "javascript:false"),
        
        disableCaching : false,
        
        showLoadIndicator : true,
        
        indicatorText : '<div class="loading-indicator">Loading...</div>'
   };


Wtf.Updater.updateElement = function(el, url, params, options){
    var um = Wtf.get(el).getUpdater();
    Wtf.apply(um, options);
    um.update(url, params, options ? options.callback : null);
};

Wtf.Updater.update = Wtf.Updater.updateElement;

Wtf.Updater.BasicRenderer = function(){};

Wtf.Updater.BasicRenderer.prototype = {
    
     render : function(el, response, updateManager, callback){
        el.update(response.responseText, updateManager.loadScripts, callback);
    }
};

Wtf.UpdateManager = Wtf.Updater;





Date.parseFunctions = {count:0};
Date.parseRegexes = [];
Date.formatFunctions = {count:0};

Date.prototype.dateFormat = function(format) {
    if (Date.formatFunctions[format] == null) {
        Date.createNewFormat(format);
    }
    var func = Date.formatFunctions[format];
    return this[func]();
};



Date.prototype.format = Date.prototype.dateFormat;

Date.createNewFormat = function(format) {
    var funcName = "format" + Date.formatFunctions.count++;
    Date.formatFunctions[format] = funcName;
    var code = "Date.prototype." + funcName + " = function(){return ";
    var special = false;
    var ch = '';
    for (var i = 0; i < format.length; ++i) {
        ch = format.charAt(i);
        if (!special && ch == "\\") {
            special = true;
        }
        else if (special) {
            special = false;
            code += "'" + String.escape(ch) + "' + ";
        }
        else {
            code += Date.getFormatCode(ch);
        }
    }
    eval(code.substring(0, code.length - 3) + ";}");
};

Date.getFormatCode = function(character) {
    switch (character) {
    case "d":
        return "String.leftPad(this.getDate(), 2, '0') + ";
    case "D":
        return "Date.getShortDayName(this.getDay()) + ";     case "j":
        return "this.getDate() + ";
    case "l":
        return "Date.dayNames[this.getDay()] + ";
    case "N":
        return "(this.getDay() ? this.getDay() : 7) + ";
    case "S":
        return "this.getSuffix() + ";
    case "w":
        return "this.getDay() + ";
    case "z":
        return "this.getDayOfYear() + ";
    case "W":
        return "String.leftPad(this.getWeekOfYear(), 2, '0') + ";
    case "F":
        return "Date.monthNames[this.getMonth()] + ";
    case "m":
        return "String.leftPad(this.getMonth() + 1, 2, '0') + ";
    case "M":
        return "Date.getShortMonthName(this.getMonth()) + ";     case "n":
        return "(this.getMonth() + 1) + ";
    case "t":
        return "this.getDaysInMonth() + ";
    case "L":
        return "(this.isLeapYear() ? 1 : 0) + ";
    case "o":
        return "(this.getFullYear() + (this.getWeekOfYear() == 1 && this.getMonth() > 0 ? +1 : (this.getWeekOfYear() >= 52 && this.getMonth() < 11 ? -1 : 0))) + ";
    case "Y":
        return "this.getFullYear() + ";
    case "y":
        return "('' + this.getFullYear()).substring(2, 4) + ";
    case "a":
        return "(this.getHours() < 12 ? 'am' : 'pm') + ";
    case "A":
        return "(this.getHours() < 12 ? 'AM' : 'PM') + ";
    case "g":
        return "((this.getHours() % 12) ? this.getHours() % 12 : 12) + ";
    case "G":
        return "this.getHours() + ";
    case "h":
        return "String.leftPad((this.getHours() % 12) ? this.getHours() % 12 : 12, 2, '0') + ";
    case "H":
        return "String.leftPad(this.getHours(), 2, '0') + ";
    case "i":
        return "String.leftPad(this.getMinutes(), 2, '0') + ";
    case "s":
        return "String.leftPad(this.getSeconds(), 2, '0') + ";
    case "u":
        return "String.leftPad(this.getMilliseconds(), 3, '0') + ";
    case "O":
        return "this.getGMTOffset() + ";
    case "P":
        return "this.getGMTOffset(true) + ";
    case "T":
        return "this.getTimezone() + ";
    case "Z":
        return "(this.getTimezoneOffset() * -60) + ";
    case "c":
        for (var df = Date.getFormatCode, c = "Y-m-dTH:i:sP", code = "", i = 0, l = c.length; i < l; ++i) {
          var e = c.charAt(i);
          code += e == "T" ? "'T' + " : df(e);         }
        return code;
    case "U":
        return "Math.round(this.getTime() / 1000) + ";
    default:
        return "'" + String.escape(character) + "' + ";
    }
};


Date.parseDate = function(input, format) {
    if (Date.parseFunctions[format] == null) {
        Date.createParser(format);
    }
    var func = Date.parseFunctions[format];
    return Date[func](input);
};

Date.createParser = function(format) {
    var funcName = "parse" + Date.parseFunctions.count++;
    var regexNum = Date.parseRegexes.length;
    var currentGroup = 1;
    Date.parseFunctions[format] = funcName;

    var code = "Date." + funcName + " = function(input){\n"
        + "var y = -1, m = -1, d = -1, h = -1, i = -1, s = -1, ms = -1, o, z, u, v;\n"
        + "var d = new Date();\n"
        + "y = d.getFullYear();\n"
        + "m = d.getMonth();\n"
        + "d = d.getDate();\n"
        + "var results = input.match(Date.parseRegexes[" + regexNum + "]);\n"
        + "if (results && results.length > 0) {";
    var regex = "";

    var special = false;
    var ch = '';
    for (var i = 0; i < format.length; ++i) {
        ch = format.charAt(i);
        if (!special && ch == "\\") {
            special = true;
        }
        else if (special) {
            special = false;
            regex += String.escape(ch);
        }
        else {
            var obj = Date.formatCodeToRegex(ch, currentGroup);
            currentGroup += obj.g;
            regex += obj.s;
            if (obj.g && obj.c) {
                code += obj.c;
            }
        }
    }

    code += "if (u)\n"
        + "{v = new Date(u * 1000);}"         + "else if (y >= 0 && m >= 0 && d > 0 && h >= 0 && i >= 0 && s >= 0 && ms >= 0)\n"
        + "{v = new Date(y, m, d, h, i, s, ms);}\n"
        + "else if (y >= 0 && m >= 0 && d > 0 && h >= 0 && i >= 0 && s >= 0)\n"
        + "{v = new Date(y, m, d, h, i, s);}\n"
        + "else if (y >= 0 && m >= 0 && d > 0 && h >= 0 && i >= 0)\n"
        + "{v = new Date(y, m, d, h, i);}\n"
        + "else if (y >= 0 && m >= 0 && d > 0 && h >= 0)\n"
        + "{v = new Date(y, m, d, h);}\n"
        + "else if (y >= 0 && m >= 0 && d > 0)\n"
        + "{v = new Date(y, m, d);}\n"
        + "else if (y >= 0 && m >= 0)\n"
        + "{v = new Date(y, m);}\n"
        + "else if (y >= 0)\n"
        + "{v = new Date(y);}\n"
        + "}return (v && (z || o))?\n"         + "    (z ? v.add(Date.SECOND, (v.getTimezoneOffset() * 60) + (z*1)) :\n"         + "        v.add(Date.HOUR, (v.getGMTOffset() / 100) + (o / -100))) : v\n"         + ";}";

    Date.parseRegexes[regexNum] = new RegExp("^" + regex + "$", "i");
    eval(code);
};

Date.formatCodeToRegex = function(character, currentGroup) {
    
    switch (character) {
    case "d":
        return {g:1,
            c:"d = parseInt(results[" + currentGroup + "], 10);\n",
            s:"(\\d{2})"};     case "D":
        for (var a = [], i = 0; i < 7; a.push(Date.getShortDayName(i)), ++i);         return {g:0,
            c:null,
            s:"(?:" + a.join("|") +")"};
    case "j":
        return {g:1,
            c:"d = parseInt(results[" + currentGroup + "], 10);\n",
            s:"(\\d{1,2})"};     case "l":
        return {g:0,
            c:null,
            s:"(?:" + Date.dayNames.join("|") + ")"};
    case "N":
        return {g:0,
            c:null,
            s:"[1-7]"};     case "S":
        return {g:0,
            c:null,
            s:"(?:st|nd|rd|th)"};
    case "w":
        return {g:0,
            c:null,
            s:"[0-6]"};     case "z":
        return {g:0,
            c:null,
            s:"(?:\\d{1,3}"};     case "W":
        return {g:0,
            c:null,
            s:"(?:\\d{2})"};     case "F":
        return {g:1,
            c:"m = parseInt(Date.getMonthNumber(results[" + currentGroup + "]), 10);\n",             s:"(" + Date.monthNames.join("|") + ")"};
    case "m":
        return {g:1,
            c:"m = parseInt(results[" + currentGroup + "], 10) - 1;\n",
            s:"(\\d{2})"};     case "M":
        for (var a = [], i = 0; i < 12; a.push(Date.getShortMonthName(i)), ++i);         return {g:1,
            c:"m = parseInt(Date.getMonthNumber(results[" + currentGroup + "]), 10);\n",             s:"(" + a.join("|") + ")"};
    case "n":
        return {g:1,
            c:"m = parseInt(results[" + currentGroup + "], 10) - 1;\n",
            s:"(\\d{1,2})"};     case "t":
        return {g:0,
            c:null,
            s:"(?:\\d{2})"};     case "L":
        return {g:0,
            c:null,
            s:"(?:1|0)"};
    case "o":
    case "Y":
        return {g:1,
            c:"y = parseInt(results[" + currentGroup + "], 10);\n",
            s:"(\\d{4})"};     case "y":
        return {g:1,
            c:"var ty = parseInt(results[" + currentGroup + "], 10);\n"
                + "y = ty > Date.y2kYear ? 1900 + ty : 2000 + ty;\n",
            s:"(\\d{1,2})"};     case "a":
        return {g:1,
            c:"if (results[" + currentGroup + "] == 'am') {\n"
                + "if (h == 12) { h = 0; }\n"
                + "} else { if (h < 12) { h += 12; }}",
            s:"(am|pm)"};
    case "A":
        return {g:1,
            c:"if (results[" + currentGroup + "] == 'AM') {\n"
                + "if (h == 12) { h = 0; }\n"
                + "} else { if (h < 12) { h += 12; }}",
            s:"(AM|PM)"};
    case "g":
    case "G":
        return {g:1,
            c:"h = parseInt(results[" + currentGroup + "], 10);\n",
            s:"(\\d{1,2})"};     case "h":
    case "H":
        return {g:1,
            c:"h = parseInt(results[" + currentGroup + "], 10);\n",
            s:"(\\d{2})"};     case "i":
        return {g:1,
            c:"i = parseInt(results[" + currentGroup + "], 10);\n",
            s:"(\\d{2})"};     case "s":
        return {g:1,
            c:"s = parseInt(results[" + currentGroup + "], 10);\n",
            s:"(\\d{2})"};     case "u":
        return {g:1,
            c:"ms = parseInt(results[" + currentGroup + "], 10);\n",
            s:"(\\d{3})"};     case "O":
        return {g:1,
            c:[
                "o = results[", currentGroup, "];\n",
                "var sn = o.substring(0,1);\n",                 "var hr = o.substring(1,3)*1 + Math.floor(o.substring(3,5) / 60);\n",                 "var mn = o.substring(3,5) % 60;\n",                 "o = ((-12 <= (hr*60 + mn)/60) && ((hr*60 + mn)/60 <= 14))?\n",                 "    (sn + String.leftPad(hr, 2, 0) + String.leftPad(mn, 2, 0)) : null;\n"
            ].join(""),
            s: "([+\-]\\d{4})"};     case "P":
        return {g:1,
            c:[
                "o = results[", currentGroup, "];\n",
                "var sn = o.substring(0,1);\n",                 "var hr = o.substring(1,3)*1 + Math.floor(o.substring(4,6) / 60);\n",                 "var mn = o.substring(4,6) % 60;\n",                 "o = ((-12 <= (hr*60 + mn)/60) && ((hr*60 + mn)/60 <= 14))?\n",                 "    (sn + String.leftPad(hr, 2, 0) + String.leftPad(mn, 2, 0)) : null;\n"
            ].join(""),
            s: "([+\-]\\d{2}:\\d{2})"};     case "T":
        return {g:0,
            c:null,
            s:"[A-Z]{1,4}"};     case "Z":
        return {g:1,
            c:"z = results[" + currentGroup + "] * 1;\n"                   + "z = (-43200 <= z && z <= 50400)? z : null;\n",
            s:"([+\-]?\\d{1,5})"};     case "c":
        var df = Date.formatCodeToRegex, calc = [];
        var arr = [df("Y", 1), df("m", 2), df("d", 3), df("h", 4), df("i", 5), df("s", 6), df("P", 7)];
        for (var i = 0, l = arr.length; i < l; ++i) {
          calc.push(arr[i].c);
        }
        return {g:1,
            c:calc.join(""),
            s:arr[0].s + "-" + arr[1].s + "-" + arr[2].s + "T" + arr[3].s + ":" + arr[4].s + ":" + arr[5].s + arr[6].s};
    case "U":
        return {g:1,
            c:"u = parseInt(results[" + currentGroup + "], 10);\n",
            s:"(-?\\d+)"};     default:
        return {g:0,
            c:null,
            s:Wtf.escapeRe(character)};
    }
};


Date.prototype.getTimezone = function() {
                                                    return this.toString().replace(/^.* (?:\((.*)\)|([A-Z]{1,4})(?:[\-+][0-9]{4})?(?: -?\d+)?)$/, "$1$2").replace(/[^A-Z]/g, "");
};


Date.prototype.getGMTOffset = function(colon) {
    return (this.getTimezoneOffset() > 0 ? "-" : "+")
        + String.leftPad(Math.abs(Math.floor(this.getTimezoneOffset() / 60)), 2, "0")
        + (colon ? ":" : "")
        + String.leftPad(this.getTimezoneOffset() % 60, 2, "0");
};


Date.prototype.getDayOfYear = function() {
    var num = 0;
    Date.daysInMonth[1] = this.isLeapYear() ? 29 : 28;
    for (var i = 0; i < this.getMonth(); ++i) {
        num += Date.daysInMonth[i];
    }
    return num + this.getDate() - 1;
};


Date.prototype.getWeekOfYear = function() {
        var ms1d = 864e5;     var ms7d = 7 * ms1d;     var DC3 = Date.UTC(this.getFullYear(), this.getMonth(), this.getDate() + 3) / ms1d;     var AWN = Math.floor(DC3 / 7);     var Wyr = new Date(AWN * ms7d).getUTCFullYear();
    return AWN - Math.floor(Date.UTC(Wyr, 0, 7) / ms7d) + 1;
};


Date.prototype.isLeapYear = function() {
    var year = this.getFullYear();
    return ((year & 3) == 0 && (year % 100 || (year % 400 == 0 && year)));
};


Date.prototype.getFirstDayOfMonth = function() {
    var day = (this.getDay() - (this.getDate() - 1)) % 7;
    return (day < 0) ? (day + 7) : day;
};


Date.prototype.getLastDayOfMonth = function() {
    var day = (this.getDay() + (Date.daysInMonth[this.getMonth()] - this.getDate())) % 7;
    return (day < 0) ? (day + 7) : day;
};



Date.prototype.getFirstDateOfMonth = function() {
    return new Date(this.getFullYear(), this.getMonth(), 1);
};


Date.prototype.getLastDateOfMonth = function() {
    return new Date(this.getFullYear(), this.getMonth(), this.getDaysInMonth());
};

Date.prototype.getDaysInMonth = function() {
    Date.daysInMonth[1] = this.isLeapYear() ? 29 : 28;
    return Date.daysInMonth[this.getMonth()];
};


Date.prototype.getSuffix = function() {
    switch (this.getDate()) {
        case 1:
        case 21:
        case 31:
            return "st";
        case 2:
        case 22:
            return "nd";
        case 3:
        case 23:
            return "rd";
        default:
            return "th";
    }
};

Date.daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31];


Date.monthNames =
   ["January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"];


Date.getShortMonthName = function(month) {
    return Date.monthNames[month].substring(0, 3);
}


Date.dayNames =
   ["Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"];


Date.getShortDayName = function(day) {
    return Date.dayNames[day].substring(0, 3);
}

Date.y2kYear = 50;


Date.monthNumbers = {
    Jan:0,
    Feb:1,
    Mar:2,
    Apr:3,
    May:4,
    Jun:5,
    Jul:6,
    Aug:7,
    Sep:8,
    Oct:9,
    Nov:10,
    Dec:11};


Date.getMonthNumber = function(name) {
        return Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
}


Date.prototype.clone = function() {
  return new Date(this.getTime());
};


Date.prototype.clearTime = function(clone){
    if(clone){
        return this.clone().clearTime();
    }
    this.setHours(0);
    this.setMinutes(0);
    this.setSeconds(0);
    this.setMilliseconds(0);
    return this;
};

if(Wtf.isSafari){
    Date.brokenSetMonth = Date.prototype.setMonth;
  Date.prototype.setMonth = function(num){
    if(num <= -1){
      var n = Math.ceil(-num);
      var back_year = Math.ceil(n/12);
      var month = (n % 12) ? 12 - n % 12 : 0 ;
      this.setFullYear(this.getFullYear() - back_year);
      return Date.brokenSetMonth.call(this, month);
    } else {
      return Date.brokenSetMonth.apply(this, arguments);
    }
  };
}


Date.MILLI = "ms";

Date.SECOND = "s";

Date.MINUTE = "mi";

Date.HOUR = "h";

Date.DAY = "d";

Date.MONTH = "mo";

Date.YEAR = "y";


Date.prototype.add = function(interval, value){
  var d = this.clone();
  if (!interval || value === 0) return d;
  switch(interval.toLowerCase()){
    case Date.MILLI:
      d.setMilliseconds(this.getMilliseconds() + value);
      break;
    case Date.SECOND:
      d.setSeconds(this.getSeconds() + value);
      break;
    case Date.MINUTE:
      d.setMinutes(this.getMinutes() + value);
      break;
    case Date.HOUR:
      d.setHours(this.getHours() + value);
      break;
    case Date.DAY:
      d.setDate(this.getDate() + value);
      break;
    case Date.MONTH:
      var day = this.getDate();
      if(day > 28){
          day = Math.min(day, this.getFirstDateOfMonth().add('mo', value).getLastDateOfMonth().getDate());
      }
      d.setDate(day);
      d.setMonth(this.getMonth() + value);
      break;
    case Date.YEAR:
      d.setFullYear(this.getFullYear() + value);
      break;
  }
  return d;
};


Date.prototype.between = function(start, end){
    var t = this.getTime();
    return start.getTime() <= t && t <= end.getTime();
}

Wtf.util.DelayedTask = function(fn, scope, args){
    var id = null, d, t;

    var call = function(){
        var now = new Date().getTime();
        if(now - t >= d){
            clearInterval(id);
            id = null;
            fn.apply(scope, args || []);
        }
    };
    
    this.delay = function(delay, newFn, newScope, newArgs){
        if(id && delay != d){
            this.cancel();
        }
        d = delay;
        t = new Date().getTime();
        fn = newFn || fn;
        scope = newScope || scope;
        args = newArgs || args;
        if(!id){
            id = setInterval(call, d);
        }
    };

    
    this.cancel = function(){
        if(id){
            clearInterval(id);
            id = null;
        }
    };
};

Wtf.util.TaskRunner = function(interval){
    interval = interval || 10;
    var tasks = [], removeQueue = [];
    var id = 0;
    var running = false;

        var stopThread = function(){
        running = false;
        clearInterval(id);
        id = 0;
    };

        var startThread = function(){
        if(!running){
            running = true;
            id = setInterval(runTasks, interval);
        }
    };

        var removeTask = function(t){
        removeQueue.push(t);
        if(t.onStop){
            t.onStop.apply(t.scope || t);
        }
    };

        var runTasks = function(){
        if(removeQueue.length > 0){
            for(var i = 0, len = removeQueue.length; i < len; i++){
                tasks.remove(removeQueue[i]);
            }
            removeQueue = [];
            if(tasks.length < 1){
                stopThread();
                return;
            }
        }
        var now = new Date().getTime();
        for(var i = 0, len = tasks.length; i < len; ++i){
            var t = tasks[i];
            var itime = now - t.taskRunTime;
            if(t.interval <= itime){
                var rt = t.run.apply(t.scope || t, t.args || [++t.taskRunCount]);
                t.taskRunTime = now;
                if(rt === false || t.taskRunCount === t.repeat){
                    removeTask(t);
                    return;
                }
            }
            if(t.duration && t.duration <= (now - t.taskStartTime)){
                removeTask(t);
            }
        }
    };

    
    this.start = function(task){
        tasks.push(task);
        task.taskStartTime = new Date().getTime();
        task.taskRunTime = 0;
        task.taskRunCount = 0;
        startThread();
        return task;
    };

    
    this.stop = function(task){
        removeTask(task);
        return task;
    };

    
    this.stopAll = function(){
        stopThread();
        for(var i = 0, len = tasks.length; i < len; i++){
            if(tasks[i].onStop){
                tasks[i].onStop();
            }
        }
        tasks = [];
        removeQueue = [];
    };
};


Wtf.TaskMgr = new Wtf.util.TaskRunner();

Wtf.util.MixedCollection = function(allowFunctions, keyFn){
    this.items = [];
    this.map = {};
    this.keys = [];
    this.length = 0;
    this.addEvents(
        
        "clear",
        
        "add",
        
        "replace",
        
        "remove",
        "sort"
    );
    this.allowFunctions = allowFunctions === true;
    if(keyFn){
        this.getKey = keyFn;
    }
    Wtf.util.MixedCollection.superclass.constructor.call(this);
};

Wtf.extend(Wtf.util.MixedCollection, Wtf.util.Observable, {
    allowFunctions : false,


    add : function(key, o){
        if(arguments.length == 1){
            o = arguments[0];
            key = this.getKey(o);
        }
        if(typeof key == "undefined" || key === null){
            this.length++;
            this.items.push(o);
            this.keys.push(null);
        }else{
            var old = this.map[key];
            if(old){
                return this.replace(key, o);
            }
            this.length++;
            this.items.push(o);
            this.map[key] = o;
            this.keys.push(key);
        }
        this.fireEvent("add", this.length-1, o, key);
        return o;
    },


    getKey : function(o){
         return o.id;
    },


    replace : function(key, o){
        if(arguments.length == 1){
            o = arguments[0];
            key = this.getKey(o);
        }
        var old = this.item(key);
        if(typeof key == "undefined" || key === null || typeof old == "undefined"){
             return this.add(key, o);
        }
        var index = this.indexOfKey(key);
        this.items[index] = o;
        this.map[key] = o;
        this.fireEvent("replace", key, old, o);
        return o;
    },


    addAll : function(objs){
        if(arguments.length > 1 || objs instanceof Array){
            var args = arguments.length > 1 ? arguments : objs;
            for(var i = 0, len = args.length; i < len; i++){
                this.add(args[i]);
            }
        }else{
            for(var key in objs){
                if(this.allowFunctions || typeof objs[key] != "function"){
                    this.add(key, objs[key]);
                }
            }
        }
    },


    each : function(fn, scope){
        var items = [].concat(this.items); 
        for(var i = 0, len = items.length; i < len; i++){
            if(fn.call(scope || items[i], items[i], i, len) === false){
                break;
            }
        }
    },


    eachKey : function(fn, scope){
        for(var i = 0, len = this.keys.length; i < len; i++){
            fn.call(scope || window, this.keys[i], this.items[i], i, len);
        }
    },

    
    find : function(fn, scope){
        for(var i = 0, len = this.items.length; i < len; i++){
            if(fn.call(scope || window, this.items[i], this.keys[i])){
                return this.items[i];
            }
        }
        return null;
    },


    insert : function(index, key, o){
        if(arguments.length == 2){
            o = arguments[1];
            key = this.getKey(o);
        }
        if(index >= this.length){
            return this.add(key, o);
        }
        this.length++;
        this.items.splice(index, 0, o);
        if(typeof key != "undefined" && key != null){
            this.map[key] = o;
        }
        this.keys.splice(index, 0, key);
        this.fireEvent("add", index, o, key);
        return o;
    },


    remove : function(o){
        return this.removeAt(this.indexOf(o));
    },


    removeAt : function(index){
        if(index < this.length && index >= 0){
            this.length--;
            var o = this.items[index];
            this.items.splice(index, 1);
            var key = this.keys[index];
            if(typeof key != "undefined"){
                delete this.map[key];
            }
            this.keys.splice(index, 1);
            this.fireEvent("remove", o, key);
            return o;
        }
        return false;
    },


    removeKey : function(key){
        return this.removeAt(this.indexOfKey(key));
    },


    getCount : function(){
        return this.length;
    },


    indexOf : function(o){
        return this.items.indexOf(o);
    },


    indexOfKey : function(key){
        return this.keys.indexOf(key);
    },


    item : function(key){
        var item = typeof this.map[key] != "undefined" ? this.map[key] : this.items[key];
        return typeof item != 'function' || this.allowFunctions ? item : null; 
    },


    itemAt : function(index){
        return this.items[index];
    },


    key : function(key){
        return this.map[key];
    },


    contains : function(o){
        return this.indexOf(o) != -1;
    },


    containsKey : function(key){
        return typeof this.map[key] != "undefined";
    },


    clear : function(){
        this.length = 0;
        this.items = [];
        this.keys = [];
        this.map = {};
        this.fireEvent("clear");
    },


    first : function(){
        return this.items[0];
    },


    last : function(){
        return this.items[this.length-1];
    },

    
    _sort : function(property, dir, fn){
        var dsc = String(dir).toUpperCase() == "DESC" ? -1 : 1;
        fn = fn || function(a, b){
            return a-b;
        };
        var c = [], k = this.keys, items = this.items;
        for(var i = 0, len = items.length; i < len; i++){
            c[c.length] = {key: k[i], value: items[i], index: i};
        }
        c.sort(function(a, b){
            var v = fn(a[property], b[property]) * dsc;
            if(v == 0){
                v = (a.index < b.index ? -1 : 1);
            }
            return v;
        });
        for(var i = 0, len = c.length; i < len; i++){
            items[i] = c[i].value;
            k[i] = c[i].key;
        }
        this.fireEvent("sort", this);
    },

    
    sort : function(dir, fn){
        this._sort("value", dir, fn);
    },

    
    keySort : function(dir, fn){
        this._sort("key", dir, fn || function(a, b){
            return String(a).toUpperCase()-String(b).toUpperCase();
        });
    },

    
    getRange : function(start, end){
        var items = this.items;
        if(items.length < 1){
            return [];
        }
        start = start || 0;
        end = Math.min(typeof end == "undefined" ? this.length-1 : end, this.length-1);
        var r = [];
        if(start <= end){
            for(var i = start; i <= end; i++) {
        	    r[r.length] = items[i];
            }
        }else{
            for(var i = start; i >= end; i--) {
        	    r[r.length] = items[i];
            }
        }
        return r;
    },

    
    filter : function(property, value, anyMatch, caseSensitive){
        if(Wtf.isEmpty(value, false)){
            return this.clone();
        }
        value = this.createValueMatcher(value, anyMatch, caseSensitive);
        return this.filterBy(function(o){
            return o && value.test(o[property]);
        });
	},

    
    filterBy : function(fn, scope){
        var r = new Wtf.util.MixedCollection();
        r.getKey = this.getKey;
        var k = this.keys, it = this.items;
        for(var i = 0, len = it.length; i < len; i++){
            if(fn.call(scope||this, it[i], k[i])){
				r.add(k[i], it[i]);
			}
        }
        return r;
    },

    
    findIndex : function(property, value, start, anyMatch, caseSensitive){
        if(Wtf.isEmpty(value, false)){
            return -1;
        }
        value = this.createValueMatcher(value, anyMatch, caseSensitive);
        return this.findIndexBy(function(o){
            return o && value.test(o[property]);
        }, null, start);
	},

    
    findIndexBy : function(fn, scope, start){
        var k = this.keys, it = this.items;
        for(var i = (start||0), len = it.length; i < len; i++){
            if(fn.call(scope||this, it[i], k[i])){
				return i;
            }
        }
        if(typeof start == 'number' && start > 0){
            for(var i = 0; i < start; i++){
                if(fn.call(scope||this, it[i], k[i])){
                    return i;
                }
            }
        }
        return -1;
    },

    
    createValueMatcher : function(value, anyMatch, caseSensitive){
        if(!value.exec){ 
            value = String(value);
            value = new RegExp((anyMatch === true ? '' : '^') + Wtf.escapeRe(value), caseSensitive ? '' : 'i');
        }
        return value;
    },

    
    clone : function(){
        var r = new Wtf.util.MixedCollection();
        var k = this.keys, it = this.items;
        for(var i = 0, len = it.length; i < len; i++){
            r.add(k[i], it[i]);
        }
        r.getKey = this.getKey;
        return r;
    }
});

Wtf.util.MixedCollection.prototype.get = Wtf.util.MixedCollection.prototype.item;

Wtf.util.JSON = new (function(){
    var useHasOwn = {}.hasOwnProperty ? true : false;
    
    
    
    
    var pad = function(n) {
        return n < 10 ? "0" + n : n;
    };
    
    var m = {
        "\b": '\\b',
        "\t": '\\t',
        "\n": '\\n',
        "\f": '\\f',
        "\r": '\\r',
        '"' : '\\"',
        "\\": '\\\\'
    };

    var encodeString = function(s){
        if (/["\\\x00-\x1f]/.test(s)) {
            return '"' + s.replace(/([\x00-\x1f\\"])/g, function(a, b) {
                var c = m[b];
                if(c){
                    return c;
                }
                c = b.charCodeAt();
                return "\\u00" +
                    Math.floor(c / 16).toString(16) +
                    (c % 16).toString(16);
            }) + '"';
        }
        return '"' + s + '"';
    };
    
    var encodeArray = function(o){
        var a = ["["], b, i, l = o.length, v;
            for (i = 0; i < l; i += 1) {
                v = o[i];
                switch (typeof v) {
                    case "undefined":
                    case "function":
                    case "unknown":
                        break;
                    default:
                        if (b) {
                            a.push(',');
                        }
                        a.push(v === null ? "null" : Wtf.util.JSON.encode(v));
                        b = true;
                }
            }
            a.push("]");
            return a.join("");
    };
    
    var encodeDate = function(o){
        return '"' + o.getFullYear() + "-" +
                pad(o.getMonth() + 1) + "-" +
                pad(o.getDate()) + "T" +
                pad(o.getHours()) + ":" +
                pad(o.getMinutes()) + ":" +
                pad(o.getSeconds()) + '"';
    };
    
    
    this.encode = function(o){
        if(typeof o == "undefined" || o === null){
            return "null";
        }else if(o instanceof Array){
            return encodeArray(o);
        }else if(o instanceof Date){
            return encodeDate(o);
        }else if(typeof o == "string"){
            return encodeString(o);
        }else if(typeof o == "number"){
            return isFinite(o) ? String(o) : "null";
        }else if(typeof o == "boolean"){
            return String(o);
        }else {
            var a = ["{"], b, i, v;
            for (i in o) {
                if(!useHasOwn || o.hasOwnProperty(i)) {
                    v = o[i];
                    switch (typeof v) {
                    case "undefined":
                    case "function":
                    case "unknown":
                        break;
                    default:
                        if(b){
                            a.push(',');
                        }
                        a.push(this.encode(i), ":",
                                v === null ? "null" : this.encode(v));
                        b = true;
                    }
                }
            }
            a.push("}");
            return a.join("");
        }
    };
    
    
    this.decode = function(json){
        return eval("(" + json + ')');
    };
})();

Wtf.encode = Wtf.util.JSON.encode;

Wtf.decode = Wtf.util.JSON.decode;


Wtf.util.Format = function(){
    var trimRe = /^\s+|\s+$/g;
    return {
        
        ellipsis : function(value, len){
            if(value && value.length > len){
                return value.substr(0, len-3)+"...";
            }
            return value;
        },

        
        undef : function(value){
            return value !== undefined ? value : "";
        },

        
        defaultValue : function(value, defaultValue){
            return value !== undefined && value !== '' ? value : defaultValue;
        },

        
        htmlEncode : function(value){
            return !value ? value : String(value).replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
        },

        
        htmlDecode : function(value){
            return !value ? value : String(value).replace(/&amp;/g, "&").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"');
        },

        
        trim : function(value){
            return String(value).replace(trimRe, "");
        },

        
        substr : function(value, start, length){
            return String(value).substr(start, length);
        },

        
        lowercase : function(value){
            return String(value).toLowerCase();
        },

        
        uppercase : function(value){
            return String(value).toUpperCase();
        },

        
        capitalize : function(value){
            return !value ? value : value.charAt(0).toUpperCase() + value.substr(1).toLowerCase();
        },

        
        call : function(value, fn){
            if(arguments.length > 2){
                var args = Array.prototype.slice.call(arguments, 2);
                args.unshift(value);
                return eval(fn).apply(window, args);
            }else{
                return eval(fn).call(window, value);
            }
        },

        
        usMoney : function(v){
            v = (Math.round((v-0)*100))/100;
            v = (v == Math.floor(v)) ? v + ".00" : ((v*10 == Math.floor(v*10)) ? v + "0" : v);
            v = String(v);
            var ps = v.split('.');
            var whole = ps[0];
            var sub = ps[1] ? '.'+ ps[1] : '.00';
            var r = /(\d+)(\d{3})/;
            while (r.test(whole)) {
                whole = whole.replace(r, '$1' + ',' + '$2');
            }
            v = whole + sub;
            if(v.charAt(0) == '-'){
                return '-$' + v.substr(1);
            }
            return "$" +  v;
        },

        
        date : function(v, format){
            if(!v){
                return "";
            }
            if(!(v instanceof Date)){
                v = new Date(Date.parse(v));
            }
            return v.dateFormat(format || "m/d/Y");
        },

        
        dateRenderer : function(format){
            return function(v){
                return Wtf.util.Format.date(v, format);
            };
        },

        
        stripTagsRE : /<\/?[^>]+>/gi,
        
        
        stripTags : function(v){
            return !v ? v : String(v).replace(this.stripTagsRE, "");
        },

        stripScriptsRe : /(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)/ig,

        
        stripScripts : function(v){
            return !v ? v : String(v).replace(this.stripScriptsRe, "");
        },

        
        fileSize : function(size){
            if(size < 1024) {
                return size + " bytes";
            } else if(size < 1048576) {
                return (Math.round(((size*10) / 1024))/10) + " KB";
            } else {
                return (Math.round(((size*10) / 1048576))/10) + " MB";
            }
        },

        math : function(){
            var fns = {};
            return function(v, a){
                if(!fns[a]){
                    fns[a] = new Function('v', 'return v ' + a + ';');
                }
                return fns[a](v);
            }
        }()
    };
}();

Wtf.XTemplate = function(){
    Wtf.XTemplate.superclass.constructor.apply(this, arguments);
    var s = this.html;

    s = ['<tpl>', s, '</tpl>'].join('');

    var re = /<tpl\b[^>]*>((?:(?=([^<]+))\2|<(?!tpl\b[^>]*>))*?)<\/tpl>/;

    var nameRe = /^<tpl\b[^>]*?for="(.*?)"/;
    var ifRe = /^<tpl\b[^>]*?if="(.*?)"/;
    var execRe = /^<tpl\b[^>]*?exec="(.*?)"/;
    var m, id = 0;
    var tpls = [];

    while(m = s.match(re)){
       var m2 = m[0].match(nameRe);
       var m3 = m[0].match(ifRe);
       var m4 = m[0].match(execRe);
       var exp = null, fn = null, exec = null;
       var name = m2 && m2[1] ? m2[1] : '';
       if(m3){
           exp = m3 && m3[1] ? m3[1] : null;
           if(exp){
               fn = new Function('values', 'parent', 'xindex', 'xcount', 'with(values){ return '+(Wtf.util.Format.htmlDecode(exp))+'; }');
           }
       }
       if(m4){
           exp = m4 && m4[1] ? m4[1] : null;
           if(exp){
               exec = new Function('values', 'parent', 'xindex', 'xcount', 'with(values){ '+(Wtf.util.Format.htmlDecode(exp))+'; }');
           }
       }
       if(name){
           switch(name){
               case '.': name = new Function('values', 'parent', 'with(values){ return values; }'); break;
               case '..': name = new Function('values', 'parent', 'with(values){ return parent; }'); break;
               default: name = new Function('values', 'parent', 'with(values){ return '+name+'; }');
           }
       }
       tpls.push({
            id: id,
            target: name,
            exec: exec,
            test: fn,
            body: m[1]||''
        });
       s = s.replace(m[0], '{xtpl'+ id + '}');
       ++id;
    }
    for(var i = tpls.length-1; i >= 0; --i){
        this.compileTpl(tpls[i]);
    }
    this.master = tpls[tpls.length-1];
    this.tpls = tpls;
};
Wtf.extend(Wtf.XTemplate, Wtf.Template, {
    
    re : /\{([\w-\.\#]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?(\s?[\+\-\*\\]\s?[\d\.\+\-\*\\\(\)]+)?\}/g,
    
    codeRe : /\{\[((?:\\\]|.|\n)*?)\]\}/g,

    
    applySubTemplate : function(id, values, parent, xindex, xcount){
        var t = this.tpls[id];
        if(t.test && !t.test.call(this, values, parent, xindex, xcount)){
            return '';
        }
        if(t.exec && t.exec.call(this, values, parent, xindex, xcount)){
            return '';
        }
        var vs = t.target ? t.target.call(this, values, parent) : values;
        parent = t.target ? values : parent;
        if(t.target && vs instanceof Array){
            var buf = [];
            for(var i = 0, len = vs.length; i < len; i++){
                buf[buf.length] = t.compiled.call(this, vs[i], parent, i+1, len);
            }
            return buf.join('');
        }
        return t.compiled.call(this, vs, parent, xindex, xcount);
    },

    
    compileTpl : function(tpl){
        var fm = Wtf.util.Format;
        var useF = this.disableFormats !== true;
        var sep = Wtf.isGecko ? "+" : ",";
        var fn = function(m, name, format, args, math){
            if(name.substr(0, 4) == 'xtpl'){
                return "'"+ sep +'this.applySubTemplate('+name.substr(4)+', values, parent, xindex, xcount)'+sep+"'";
            }
            var v;
            if(name === '.'){
                v = 'values';
            }else if(name === '#'){
                v = 'xindex';
            }else if(name.indexOf('.') != -1){
                v = name;
            }else{
                v = "values['" + name + "']";
            }
            if(math){
                v = '(' + v + math + ')';
            }
            if(format && useF){
                args = args ? ',' + args : "";
                if(format.substr(0, 5) != "this."){
                    format = "fm." + format + '(';
                }else{
                    format = 'this.call("'+ format.substr(5) + '", ';
                    args = ", values";
                }
            }else{
                args= ''; format = "("+v+" === undefined ? '' : ";
            }
            return "'"+ sep + format + v + args + ")"+sep+"'";
        };
        var codeFn = function(m, code){
            return "'"+ sep +'('+code+')'+sep+"'";
        };

        var body;
        
        if(Wtf.isGecko){
            body = "tpl.compiled = function(values, parent, xindex, xcount){ return '" +
                   tpl.body.replace(/(\r\n|\n)/g, '\\n').replace(/'/g, "\\'").replace(this.re, fn).replace(this.codeRe, codeFn) +
                    "';};";
        }else{
            body = ["tpl.compiled = function(values, parent, xindex, xcount){ return ['"];
            body.push(tpl.body.replace(/(\r\n|\n)/g, '\\n').replace(/'/g, "\\'").replace(this.re, fn).replace(this.codeRe, codeFn));
            body.push("'].join('');};");
            body = body.join('');
        }
        eval(body);
        return this;
    },

    
    apply : function(values){
        return this.master.compiled.call(this, values, {}, 1, 1);
    },

    
    applyTemplate : function(values){
        return this.master.compiled.call(this, values, {}, 1, 1);
    },

    
    compile : function(){return this;}

    
    
    
    
});


Wtf.XTemplate.from = function(el){
    el = Wtf.getDom(el);
    return new Wtf.XTemplate(el.value || el.innerHTML);
};

Wtf.util.CSS = function(){
	var rules = null;
   	var doc = document;

    var camelRe = /(-[a-z])/gi;
    var camelFn = function(m, a){ return a.charAt(1).toUpperCase(); };

   return {
   
   createStyleSheet : function(cssText, id){
       var ss;
       var head = doc.getElementsByTagName("head")[0];
       var rules = doc.createElement("style");
       rules.setAttribute("type", "text/css");
       if(id){
           rules.setAttribute("id", id);
       }
       if(Wtf.isIE){
           head.appendChild(rules);
           ss = rules.styleSheet;
           ss.cssText = cssText;
       }else{
           try{
                rules.appendChild(doc.createTextNode(cssText));
           }catch(e){
               rules.cssText = cssText;
           }
           head.appendChild(rules);
           ss = rules.styleSheet ? rules.styleSheet : (rules.sheet || doc.styleSheets[doc.styleSheets.length-1]);
       }
       this.cacheStyleSheet(ss);
       return ss;
   },

   
   removeStyleSheet : function(id){
       var existing = doc.getElementById(id);
       if(existing){
           existing.parentNode.removeChild(existing);
       }
   },

   
   swapStyleSheet : function(id, url){
       this.removeStyleSheet(id);
       var ss = doc.createElement("link");
       ss.setAttribute("rel", "stylesheet");
       ss.setAttribute("type", "text/css");
       ss.setAttribute("id", id);
       ss.setAttribute("href", url);
       doc.getElementsByTagName("head")[0].appendChild(ss);
   },
   
   
   refreshCache : function(){
       return this.getRules(true);
   },

   
   cacheStyleSheet : function(ss){
       if(!rules){
           rules = {};
       }
       try{
           var ssRules = ss.cssRules || ss.rules;
           for(var j = ssRules.length-1; j >= 0; --j){
               rules[ssRules[j].selectorText] = ssRules[j];
           }
       }catch(e){}
   },
   
   
   getRules : function(refreshCache){
   		if(rules == null || refreshCache){
   			rules = {};
   			var ds = doc.styleSheets;
   			for(var i =0, len = ds.length; i < len; i++){
   			    try{
    		        this.cacheStyleSheet(ds[i]);
    		    }catch(e){} 
	        }
   		}
   		return rules;
   	},
   	
   	
   getRule : function(selector, refreshCache){
   		var rs = this.getRules(refreshCache);
   		if(!(selector instanceof Array)){
   		    return rs[selector];
   		}
   		for(var i = 0; i < selector.length; i++){
			if(rs[selector[i]]){
				return rs[selector[i]];
			}
		}
		return null;
   	},
   	
   	
   	
   updateRule : function(selector, property, value){
   		if(!(selector instanceof Array)){
   			var rule = this.getRule(selector);
   			if(rule){
   				rule.style[property.replace(camelRe, camelFn)] = value;
   				return true;
   			}
   		}else{
   			for(var i = 0; i < selector.length; i++){
   				if(this.updateRule(selector[i], property, value)){
   					return true;
   				}
   			}
   		}
   		return false;
   	}
   };	
}();

Wtf.util.ClickRepeater = function(el, config)
{
    this.el = Wtf.get(el);
    this.el.unselectable();

    Wtf.apply(this, config);

    this.addEvents(
    
        "mousedown",
    
        "click",
    
        "mouseup"
    );

    this.el.on("mousedown", this.handleMouseDown, this);
    if(this.preventDefault || this.stopDefault){
        this.el.on("click", function(e){
            if(this.preventDefault){
                e.preventDefault();
            }
            if(this.stopDefault){
                e.stopEvent();
            }
        }, this);
    }

        if(this.handler){
        this.on("click", this.handler,  this.scope || this);
    }

    Wtf.util.ClickRepeater.superclass.constructor.call(this);
};

Wtf.extend(Wtf.util.ClickRepeater, Wtf.util.Observable, {
    interval : 20,
    delay: 250,
    preventDefault : true,
    stopDefault : false,
    timer : 0,

        handleMouseDown : function(){
        clearTimeout(this.timer);
        this.el.blur();
        if(this.pressClass){
            this.el.addClass(this.pressClass);
        }
        this.mousedownTime = new Date();

        Wtf.getDoc().on("mouseup", this.handleMouseUp, this);
        this.el.on("mouseout", this.handleMouseOut, this);

        this.fireEvent("mousedown", this);
        this.fireEvent("click", this);

        if (this.accelerate) {
            this.delay = 400;
	    }
        this.timer = this.click.defer(this.delay || this.interval, this);
    },

        click : function(){
        this.fireEvent("click", this);
        this.timer = this.click.defer(this.accelerate ?
            this.easeOutExpo(this.mousedownTime.getElapsed(),
                400,
                -390,
                12000) :
            this.interval, this);
    },

    easeOutExpo : function (t, b, c, d) {
        return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
    },

        handleMouseOut : function(){
        clearTimeout(this.timer);
        if(this.pressClass){
            this.el.removeClass(this.pressClass);
        }
        this.el.on("mouseover", this.handleMouseReturn, this);
    },

        handleMouseReturn : function(){
        this.el.un("mouseover", this.handleMouseReturn);
        if(this.pressClass){
            this.el.addClass(this.pressClass);
        }
        this.click();
    },

        handleMouseUp : function(){
        clearTimeout(this.timer);
        this.el.un("mouseover", this.handleMouseReturn);
        this.el.un("mouseout", this.handleMouseOut);
        Wtf.getDoc().un("mouseup", this.handleMouseUp);
        this.el.removeClass(this.pressClass);
        this.fireEvent("mouseup", this);
    }
});

Wtf.KeyNav = function(el, config){
    this.el = Wtf.get(el);
    Wtf.apply(this, config);
    if(!this.disabled){
        this.disabled = true;
        this.enable();
    }
};

Wtf.KeyNav.prototype = {
    
    disabled : false,
    
    defaultEventAction: "stopEvent",
    
    forceKeyDown : false,

        prepareEvent : function(e){
        var k = e.getKey();
        var h = this.keyToHandler[k];
                                if(Wtf.isSafari && h && k >= 37 && k <= 40){
            e.stopEvent();
        }
    },

        relay : function(e){
        var k = e.getKey();
        var h = this.keyToHandler[k];
        if(h && this[h]){
            if(this.doRelay(e, this[h], h) !== true){
                e[this.defaultEventAction]();
            }
        }
    },

        doRelay : function(e, h, hname){
        return h.call(this.scope || this, e);
    },

        enter : false,
    left : false,
    right : false,
    up : false,
    down : false,
    tab : false,
    esc : false,
    pageUp : false,
    pageDown : false,
    del : false,
    home : false,
    end : false,

        keyToHandler : {
        37 : "left",
        39 : "right",
        38 : "up",
        40 : "down",
        33 : "pageUp",
        34 : "pageDown",
        46 : "del",
        36 : "home",
        35 : "end",
        13 : "enter",
        27 : "esc",
        9  : "tab"
    },

	
	enable: function(){
		if(this.disabled){
                                    if(this.forceKeyDown || Wtf.isIE || Wtf.isAir){
                this.el.on("keydown", this.relay,  this);
            }else{
                this.el.on("keydown", this.prepareEvent,  this);
                this.el.on("keypress", this.relay,  this);
            }
		    this.disabled = false;
		}
	},

	
	disable: function(){
		if(!this.disabled){
		    if(this.forceKeyDown || Wtf.isIE || Wtf.isAir){
                this.el.un("keydown", this.relay);
            }else{
                this.el.un("keydown", this.prepareEvent);
                this.el.un("keypress", this.relay);
            }
		    this.disabled = true;
		}
	}
};

Wtf.KeyMap = function(el, config, eventName){
    this.el  = Wtf.get(el);
    this.eventName = eventName || "keydown";
    this.bindings = [];
    if(config){
        this.addBinding(config);
    }
    this.enable();
};

Wtf.KeyMap.prototype = {
    
    stopEvent : false,

    
	addBinding : function(config){
        if(config instanceof Array){
            for(var i = 0, len = config.length; i < len; i++){
                this.addBinding(config[i]);
            }
            return;
        }
        var keyCode = config.key,
            shift = config.shift,
            ctrl = config.ctrl,
            alt = config.alt,
            fn = config.fn || config.handler,
            scope = config.scope;

        if(typeof keyCode == "string"){
            var ks = [];
            var keyString = keyCode.toUpperCase();
            for(var j = 0, len = keyString.length; j < len; j++){
                ks.push(keyString.charCodeAt(j));
            }
            keyCode = ks;
        }
        var keyArray = keyCode instanceof Array;
        
        var handler = function(e){
            if((!shift || e.shiftKey) && (!ctrl || e.ctrlKey) &&  (!alt || e.altKey)){
                var k = e.getKey();
                if(keyArray){
                    for(var i = 0, len = keyCode.length; i < len; i++){
                        if(keyCode[i] == k){
                          if(this.stopEvent){
                              e.stopEvent();
                          }
                          fn.call(scope || window, k, e);
                          return;
                        }
                    }
                }else{
                    if(k == keyCode){
                        if(this.stopEvent){
                           e.stopEvent();
                        }
                        fn.call(scope || window, k, e);
                    }
                }
            }
        };
        this.bindings.push(handler);
	},

    
    on : function(key, fn, scope){
        var keyCode, shift, ctrl, alt;
        if(typeof key == "object" && !(key instanceof Array)){
            keyCode = key.key;
            shift = key.shift;
            ctrl = key.ctrl;
            alt = key.alt;
        }else{
            keyCode = key;
        }
        this.addBinding({
            key: keyCode,
            shift: shift,
            ctrl: ctrl,
            alt: alt,
            fn: fn,
            scope: scope
        })
    },

    
    handleKeyDown : function(e){
	    if(this.enabled){ 
    	    var b = this.bindings;
    	    for(var i = 0, len = b.length; i < len; i++){
    	        b[i].call(this, e);
    	    }
	    }
	},

	
	isEnabled : function(){
	    return this.enabled;
	},

	
	enable: function(){
		if(!this.enabled){
		    this.el.on(this.eventName, this.handleKeyDown, this);
		    this.enabled = true;
		}
	},

	
	disable: function(){
		if(this.enabled){
		    this.el.removeListener(this.eventName, this.handleKeyDown, this);
		    this.enabled = false;
		}
	}
};

Wtf.util.TextMetrics = function(){
    var shared;
    return {
        
        measure : function(el, text, fixedWidth){
            if(!shared){
                shared = Wtf.util.TextMetrics.Instance(el, fixedWidth);
            }
            shared.bind(el);
            shared.setFixedWidth(fixedWidth || 'auto');
            return shared.getSize(text);
        },

        
        createInstance : function(el, fixedWidth){
            return Wtf.util.TextMetrics.Instance(el, fixedWidth);
        }
    };
}();

Wtf.util.TextMetrics.Instance = function(bindTo, fixedWidth){
    var ml = new Wtf.Element(document.createElement('div'));
    document.body.appendChild(ml.dom);
    ml.position('absolute');
    ml.setLeftTop(-1000, -1000);
    ml.hide();

    if(fixedWidth){
        ml.setWidth(fixedWidth);
    }

    var instance = {
        
        getSize : function(text){
            ml.update(text);
            var s = ml.getSize();
            ml.update('');
            return s;
        },

        
        bind : function(el){
            ml.setStyle(
                Wtf.fly(el).getStyles('font-size','font-style', 'font-weight', 'font-family','line-height')
            );
        },

        
        setFixedWidth : function(width){
            ml.setWidth(width);
        },

        
        getWidth : function(text){
            ml.dom.style.width = 'auto';
            return this.getSize(text).width;
        },

        
        getHeight : function(text){
            return this.getSize(text).height;
        }
    };

    instance.bind(bindTo);

    return instance;
};

Wtf.Element.measureText = Wtf.util.TextMetrics.measure;


(function() {

var Event=Wtf.EventManager;
var Dom=Wtf.lib.Dom;


Wtf.dd.DragDrop = function(id, sGroup, config) {
    if(id) {
        this.init(id, sGroup, config);
    }
};

Wtf.dd.DragDrop.prototype = {

    
    id: null,

    
    config: null,

    
    dragElId: null,

    
    handleElId: null,

    
    invalidHandleTypes: null,

    
    invalidHandleIds: null,

    
    invalidHandleClasses: null,

    
    startPageX: 0,

    
    startPageY: 0,

    
    groups: null,

    
    locked: false,

    
    lock: function() { this.locked = true; },

    
    unlock: function() { this.locked = false; },

    
    isTarget: true,

    
    padding: null,

    
    _domRef: null,

    
    __ygDragDrop: true,

    
    constrainX: false,

    
    constrainY: false,

    
    minX: 0,

    
    maxX: 0,

    
    minY: 0,

    
    maxY: 0,

    
    maintainOffset: false,

    
    xTicks: null,

    
    yTicks: null,

    
    primaryButtonOnly: true,

    
    available: false,

    
    hasOuterHandles: false,

    
    b4StartDrag: function(x, y) { },

    
    startDrag: function(x, y) {  },

    
    b4Drag: function(e) { },

    
    onDrag: function(e) {  },

    
    onDragEnter: function(e, id) {  },

    
    b4DragOver: function(e) { },

    
    onDragOver: function(e, id) {  },

    
    b4DragOut: function(e) { },

    
    onDragOut: function(e, id) {  },

    
    b4DragDrop: function(e) { },

    
    onDragDrop: function(e, id) {  },

    
    onInvalidDrop: function(e) {  },

    
    b4EndDrag: function(e) { },

    
    endDrag: function(e) {  },

    
    b4MouseDown: function(e) {  },

    
    onMouseDown: function(e) {  },

    
    onMouseUp: function(e) {  },

    
    onAvailable: function () {
    },

    
    defaultPadding : {left:0, right:0, top:0, bottom:0},

    
    constrainTo : function(constrainTo, pad, inContent){
        if(typeof pad == "number"){
            pad = {left: pad, right:pad, top:pad, bottom:pad};
        }
        pad = pad || this.defaultPadding;
        var b = Wtf.get(this.getEl()).getBox();
        var ce = Wtf.get(constrainTo);
        var s = ce.getScroll();
        var c, cd = ce.dom;
        if(cd == document.body){
            c = { x: s.left, y: s.top, width: Wtf.lib.Dom.getViewWidth(), height: Wtf.lib.Dom.getViewHeight()};
        }else{
            var xy = ce.getXY();
            c = {x : xy[0]+s.left, y: xy[1]+s.top, width: cd.clientWidth, height: cd.clientHeight};
        }


        var topSpace = b.y - c.y;
        var leftSpace = b.x - c.x;

        this.resetConstraints();
        this.setXConstraint(leftSpace - (pad.left||0), 
                c.width - leftSpace - b.width - (pad.right||0), 
				this.xTickSize
        );
        this.setYConstraint(topSpace - (pad.top||0), 
                c.height - topSpace - b.height - (pad.bottom||0), 
				this.yTickSize
        );
    },

    
    getEl: function() {
        if (!this._domRef) {
            this._domRef = Wtf.getDom(this.id);
        }

        return this._domRef;
    },

    
    getDragEl: function() {
        return Wtf.getDom(this.dragElId);
    },

    
    init: function(id, sGroup, config) {
        this.initTarget(id, sGroup, config);
        Event.on(this.id, "mousedown", this.handleMouseDown, this);
        
    },

    
    initTarget: function(id, sGroup, config) {

        
        this.config = config || {};

        
        this.DDM = Wtf.dd.DDM;
        
        this.groups = {};

        
        
        if (typeof id !== "string") {
            id = Wtf.id(id);
        }

        
        this.id = id;

        
        this.addToGroup((sGroup) ? sGroup : "default");

        
        
        this.handleElId = id;

        
        this.setDragElId(id);

        
        this.invalidHandleTypes = { A: "A" };
        this.invalidHandleIds = {};
        this.invalidHandleClasses = [];

        this.applyConfig();

        this.handleOnAvailable();
    },

    
    applyConfig: function() {

        
        
        this.padding           = this.config.padding || [0, 0, 0, 0];
        this.isTarget          = (this.config.isTarget !== false);
        this.maintainOffset    = (this.config.maintainOffset);
        this.primaryButtonOnly = (this.config.primaryButtonOnly !== false);

    },

    
    handleOnAvailable: function() {
        this.available = true;
        this.resetConstraints();
        this.onAvailable();
    },

     
    setPadding: function(iTop, iRight, iBot, iLeft) {
        
        if (!iRight && 0 !== iRight) {
            this.padding = [iTop, iTop, iTop, iTop];
        } else if (!iBot && 0 !== iBot) {
            this.padding = [iTop, iRight, iTop, iRight];
        } else {
            this.padding = [iTop, iRight, iBot, iLeft];
        }
    },

    
    setInitPosition: function(diffX, diffY) {
        var el = this.getEl();

        if (!this.DDM.verifyEl(el)) {
            return;
        }

        var dx = diffX || 0;
        var dy = diffY || 0;

        var p = Dom.getXY( el );

        this.initPageX = p[0] - dx;
        this.initPageY = p[1] - dy;

        this.lastPageX = p[0];
        this.lastPageY = p[1];


        this.setStartPosition(p);
    },

    
    setStartPosition: function(pos) {
        var p = pos || Dom.getXY( this.getEl() );
        this.deltaSetXY = null;

        this.startPageX = p[0];
        this.startPageY = p[1];
    },

    
    addToGroup: function(sGroup) {
        this.groups[sGroup] = true;
        this.DDM.regDragDrop(this, sGroup);
    },

    
    removeFromGroup: function(sGroup) {
        if (this.groups[sGroup]) {
            delete this.groups[sGroup];
        }

        this.DDM.removeDDFromGroup(this, sGroup);
    },

    
    setDragElId: function(id) {
        this.dragElId = id;
    },

    
    setHandleElId: function(id) {
        if (typeof id !== "string") {
            id = Wtf.id(id);
        }
        this.handleElId = id;
        this.DDM.regHandle(this.id, id);
    },

    
    setOuterHandleElId: function(id) {
        if (typeof id !== "string") {
            id = Wtf.id(id);
        }
        Event.on(id, "mousedown",
                this.handleMouseDown, this);
        this.setHandleElId(id);

        this.hasOuterHandles = true;
    },

    
    unreg: function() {
        Event.un(this.id, "mousedown",
                this.handleMouseDown);
        this._domRef = null;
        this.DDM._remove(this);
    },

    destroy : function(){
        this.unreg();
    },

    
    isLocked: function() {
        return (this.DDM.isLocked() || this.locked);
    },

    
    handleMouseDown: function(e, oDD){
        if (this.primaryButtonOnly && e.button != 0) {
            return;
        }

        if (this.isLocked()) {
            return;
        }

        this.DDM.refreshCache(this.groups);

        var pt = new Wtf.lib.Point(Wtf.lib.Event.getPageX(e), Wtf.lib.Event.getPageY(e));
        if (!this.hasOuterHandles && !this.DDM.isOverTarget(pt, this) )  {
        } else {
            if (this.clickValidator(e)) {

                
                this.setStartPosition();


                this.b4MouseDown(e);
                this.onMouseDown(e);

                this.DDM.handleMouseDown(e, this);

                this.DDM.stopEvent(e);
            } else {


            }
        }
    },

    clickValidator: function(e) {
        var target = e.getTarget();
        return ( this.isValidHandleChild(target) &&
                    (this.id == this.handleElId ||
                        this.DDM.handleWasClicked(target, this.id)) );
    },

    
    addInvalidHandleType: function(tagName) {
        var type = tagName.toUpperCase();
        this.invalidHandleTypes[type] = type;
    },

    
    addInvalidHandleId: function(id) {
        if (typeof id !== "string") {
            id = Wtf.id(id);
        }
        this.invalidHandleIds[id] = id;
    },

    
    addInvalidHandleClass: function(cssClass) {
        this.invalidHandleClasses.push(cssClass);
    },

    
    removeInvalidHandleType: function(tagName) {
        var type = tagName.toUpperCase();
        
        delete this.invalidHandleTypes[type];
    },

    
    removeInvalidHandleId: function(id) {
        if (typeof id !== "string") {
            id = Wtf.id(id);
        }
        delete this.invalidHandleIds[id];
    },

    
    removeInvalidHandleClass: function(cssClass) {
        for (var i=0, len=this.invalidHandleClasses.length; i<len; ++i) {
            if (this.invalidHandleClasses[i] == cssClass) {
                delete this.invalidHandleClasses[i];
            }
        }
    },

    
    isValidHandleChild: function(node) {

        var valid = true;
        
        var nodeName;
        try {
            nodeName = node.nodeName.toUpperCase();
        } catch(e) {
            nodeName = node.nodeName;
        }
        valid = valid && !this.invalidHandleTypes[nodeName];
        valid = valid && !this.invalidHandleIds[node.id];

        for (var i=0, len=this.invalidHandleClasses.length; valid && i<len; ++i) {
            valid = !Dom.hasClass(node, this.invalidHandleClasses[i]);
        }


        return valid;

    },

    
    setXTicks: function(iStartX, iTickSize) {
        this.xTicks = [];
        this.xTickSize = iTickSize;

        var tickMap = {};

        for (var i = this.initPageX; i >= this.minX; i = i - iTickSize) {
            if (!tickMap[i]) {
                this.xTicks[this.xTicks.length] = i;
                tickMap[i] = true;
            }
        }

        for (i = this.initPageX; i <= this.maxX; i = i + iTickSize) {
            if (!tickMap[i]) {
                this.xTicks[this.xTicks.length] = i;
                tickMap[i] = true;
            }
        }

        this.xTicks.sort(this.DDM.numericSort) ;
    },

    
    setYTicks: function(iStartY, iTickSize) {
        this.yTicks = [];
        this.yTickSize = iTickSize;

        var tickMap = {};

        for (var i = this.initPageY; i >= this.minY; i = i - iTickSize) {
            if (!tickMap[i]) {
                this.yTicks[this.yTicks.length] = i;
                tickMap[i] = true;
            }
        }

        for (i = this.initPageY; i <= this.maxY; i = i + iTickSize) {
            if (!tickMap[i]) {
                this.yTicks[this.yTicks.length] = i;
                tickMap[i] = true;
            }
        }

        this.yTicks.sort(this.DDM.numericSort) ;
    },

    
    setXConstraint: function(iLeft, iRight, iTickSize) {
        this.leftConstraint = iLeft;
        this.rightConstraint = iRight;

        this.minX = this.initPageX - iLeft;
        this.maxX = this.initPageX + iRight;
        if (iTickSize) { this.setXTicks(this.initPageX, iTickSize); }

        this.constrainX = true;
    },

    
    clearConstraints: function() {
        this.constrainX = false;
        this.constrainY = false;
        this.clearTicks();
    },

    
    clearTicks: function() {
        this.xTicks = null;
        this.yTicks = null;
        this.xTickSize = 0;
        this.yTickSize = 0;
    },

    
    setYConstraint: function(iUp, iDown, iTickSize) {
        this.topConstraint = iUp;
        this.bottomConstraint = iDown;

        this.minY = this.initPageY - iUp;
        this.maxY = this.initPageY + iDown;
        if (iTickSize) { this.setYTicks(this.initPageY, iTickSize); }

        this.constrainY = true;

    },

    
    resetConstraints: function() {


        
        if (this.initPageX || this.initPageX === 0) {
            
            var dx = (this.maintainOffset) ? this.lastPageX - this.initPageX : 0;
            var dy = (this.maintainOffset) ? this.lastPageY - this.initPageY : 0;

            this.setInitPosition(dx, dy);

        
        } else {
            this.setInitPosition();
        }

        if (this.constrainX) {
            this.setXConstraint( this.leftConstraint,
                                 this.rightConstraint,
                                 this.xTickSize        );
        }

        if (this.constrainY) {
            this.setYConstraint( this.topConstraint,
                                 this.bottomConstraint,
                                 this.yTickSize         );
        }
    },

    
    getTick: function(val, tickArray) {

        if (!tickArray) {
            
            
            return val;
        } else if (tickArray[0] >= val) {
            
            
            return tickArray[0];
        } else {
            for (var i=0, len=tickArray.length; i<len; ++i) {
                var next = i + 1;
                if (tickArray[next] && tickArray[next] >= val) {
                    var diff1 = val - tickArray[i];
                    var diff2 = tickArray[next] - val;
                    return (diff2 > diff1) ? tickArray[i] : tickArray[next];
                }
            }

            
            
            return tickArray[tickArray.length - 1];
        }
    },

    
    toString: function() {
        return ("DragDrop " + this.id);
    }

};

})();




if (!Wtf.dd.DragDropMgr) {


Wtf.dd.DragDropMgr = function() {

    var Event = Wtf.EventManager;

    return {

        
        ids: {},

        
        handleIds: {},

        
        dragCurrent: null,

        
        dragOvers: {},

        
        deltaX: 0,

        
        deltaY: 0,

        
        preventDefault: true,

        
        stopPropagation: true,

        
        initalized: false,

        
        locked: false,

        
        init: function() {
            this.initialized = true;
        },

        
        POINT: 0,

        
        INTERSECT: 1,

        
        mode: 0,

        
        _execOnAll: function(sMethod, args) {
            for (var i in this.ids) {
                for (var j in this.ids[i]) {
                    var oDD = this.ids[i][j];
                    if (! this.isTypeOfDD(oDD)) {
                        continue;
                    }
                    oDD[sMethod].apply(oDD, args);
                }
            }
        },

        
        _onLoad: function() {

            this.init();


            Event.on(document, "mouseup",   this.handleMouseUp, this, true);
            Event.on(document, "mousemove", this.handleMouseMove, this, true);
            Event.on(window,   "unload",    this._onUnload, this, true);
            Event.on(window,   "resize",    this._onResize, this, true);
            

        },

        
        _onResize: function(e) {
            this._execOnAll("resetConstraints", []);
        },

        
        lock: function() { this.locked = true; },

        
        unlock: function() { this.locked = false; },

        
        isLocked: function() { return this.locked; },

        
        locationCache: {},

        
        useCache: true,

        
        clickPixelThresh: 3,

        
        clickTimeThresh: 350,

        
        dragThreshMet: false,

        
        clickTimeout: null,

        
        startX: 0,

        
        startY: 0,

        
        regDragDrop: function(oDD, sGroup) {
            if (!this.initialized) { this.init(); }

            if (!this.ids[sGroup]) {
                this.ids[sGroup] = {};
            }
            this.ids[sGroup][oDD.id] = oDD;
        },

        
        removeDDFromGroup: function(oDD, sGroup) {
            if (!this.ids[sGroup]) {
                this.ids[sGroup] = {};
            }

            var obj = this.ids[sGroup];
            if (obj && obj[oDD.id]) {
                delete obj[oDD.id];
            }
        },

        
        _remove: function(oDD) {
            for (var g in oDD.groups) {
                if (g && this.ids[g][oDD.id]) {
                    delete this.ids[g][oDD.id];
                }
            }
            delete this.handleIds[oDD.id];
        },

        
        regHandle: function(sDDId, sHandleId) {
            if (!this.handleIds[sDDId]) {
                this.handleIds[sDDId] = {};
            }
            this.handleIds[sDDId][sHandleId] = sHandleId;
        },

        
        isDragDrop: function(id) {
            return ( this.getDDById(id) ) ? true : false;
        },

        
        getRelated: function(p_oDD, bTargetsOnly) {
            var oDDs = [];
            for (var i in p_oDD.groups) {
                for (j in this.ids[i]) {
                    var dd = this.ids[i][j];
                    if (! this.isTypeOfDD(dd)) {
                        continue;
                    }
                    if (!bTargetsOnly || dd.isTarget) {
                        oDDs[oDDs.length] = dd;
                    }
                }
            }

            return oDDs;
        },

        
        isLegalTarget: function (oDD, oTargetDD) {
            var targets = this.getRelated(oDD, true);
            for (var i=0, len=targets.length;i<len;++i) {
                if (targets[i].id == oTargetDD.id) {
                    return true;
                }
            }

            return false;
        },

        
        isTypeOfDD: function (oDD) {
            return (oDD && oDD.__ygDragDrop);
        },

        
        isHandle: function(sDDId, sHandleId) {
            return ( this.handleIds[sDDId] &&
                            this.handleIds[sDDId][sHandleId] );
        },

        
        getDDById: function(id) {
            for (var i in this.ids) {
                if (this.ids[i][id]) {
                    return this.ids[i][id];
                }
            }
            return null;
        },

        
        handleMouseDown: function(e, oDD) {
            if(Wtf.QuickTips){
                Wtf.QuickTips.disable();
            }
            this.currentTarget = e.getTarget();

            this.dragCurrent = oDD;

            var el = oDD.getEl();

            
            this.startX = e.getPageX();
            this.startY = e.getPageY();

            this.deltaX = this.startX - el.offsetLeft;
            this.deltaY = this.startY - el.offsetTop;

            this.dragThreshMet = false;

            this.clickTimeout = setTimeout(
                    function() {
                        var DDM = Wtf.dd.DDM;
                        DDM.startDrag(DDM.startX, DDM.startY);
                    },
                    this.clickTimeThresh );
        },

        
        startDrag: function(x, y) {
            clearTimeout(this.clickTimeout);
            if (this.dragCurrent) {
                this.dragCurrent.b4StartDrag(x, y);
                this.dragCurrent.startDrag(x, y);
            }
            this.dragThreshMet = true;
        },

        
        handleMouseUp: function(e) {

            if(Wtf.QuickTips){
                Wtf.QuickTips.enable();
            }
            if (! this.dragCurrent) {
                return;
            }

            clearTimeout(this.clickTimeout);

            if (this.dragThreshMet) {
                this.fireEvents(e, true);
            } else {
            }

            this.stopDrag(e);

            this.stopEvent(e);
        },

        
        stopEvent: function(e){
            if(this.stopPropagation) {
                e.stopPropagation();
            }

            if (this.preventDefault) {
                e.preventDefault();
            }
        },

        
        stopDrag: function(e) {
            
            if (this.dragCurrent) {
                if (this.dragThreshMet) {
                    this.dragCurrent.b4EndDrag(e);
                    this.dragCurrent.endDrag(e);
                }

                this.dragCurrent.onMouseUp(e);
            }

            this.dragCurrent = null;
            this.dragOvers = {};
        },

        
        handleMouseMove: function(e) {
            if (! this.dragCurrent) {
                return true;
            }

            

            
            if (Wtf.isIE && (e.button !== 0 && e.button !== 1 && e.button !== 2)) {
                this.stopEvent(e);
                return this.handleMouseUp(e);
            }

            if (!this.dragThreshMet) {
                var diffX = Math.abs(this.startX - e.getPageX());
                var diffY = Math.abs(this.startY - e.getPageY());
                if (diffX > this.clickPixelThresh ||
                            diffY > this.clickPixelThresh) {
                    this.startDrag(this.startX, this.startY);
                }
            }

            if (this.dragThreshMet) {
                this.dragCurrent.b4Drag(e);
                this.dragCurrent.onDrag(e);
                if(!this.dragCurrent.moveOnly){
                    this.fireEvents(e, false);
                }
            }

            this.stopEvent(e);

            return true;
        },

        
        fireEvents: function(e, isDrop) {
            var dc = this.dragCurrent;

            
            
            if (!dc || dc.isLocked()) {
                return;
            }

            var pt = e.getPoint();

            
            var oldOvers = [];

            var outEvts   = [];
            var overEvts  = [];
            var dropEvts  = [];
            var enterEvts = [];

            
            
            for (var i in this.dragOvers) {

                var ddo = this.dragOvers[i];

                if (! this.isTypeOfDD(ddo)) {
                    continue;
                }

                if (! this.isOverTarget(pt, ddo, this.mode)) {
                    outEvts.push( ddo );
                }

                oldOvers[i] = true;
                delete this.dragOvers[i];
            }

            for (var sGroup in dc.groups) {

                if ("string" != typeof sGroup) {
                    continue;
                }

                for (i in this.ids[sGroup]) {
                    var oDD = this.ids[sGroup][i];
                    if (! this.isTypeOfDD(oDD)) {
                        continue;
                    }

                    if (oDD.isTarget && !oDD.isLocked() && oDD != dc) {
                        if (this.isOverTarget(pt, oDD, this.mode)) {
                            
                            if (isDrop) {
                                dropEvts.push( oDD );
                            
                            } else {

                                
                                if (!oldOvers[oDD.id]) {
                                    enterEvts.push( oDD );
                                
                                } else {
                                    overEvts.push( oDD );
                                }

                                this.dragOvers[oDD.id] = oDD;
                            }
                        }
                    }
                }
            }

            if (this.mode) {
                if (outEvts.length) {
                    dc.b4DragOut(e, outEvts);
                    dc.onDragOut(e, outEvts);
                }

                if (enterEvts.length) {
                    dc.onDragEnter(e, enterEvts);
                }

                if (overEvts.length) {
                    dc.b4DragOver(e, overEvts);
                    dc.onDragOver(e, overEvts);
                }

                if (dropEvts.length) {
                    dc.b4DragDrop(e, dropEvts);
                    dc.onDragDrop(e, dropEvts);
                }

            } else {
                
                var len = 0;
                for (i=0, len=outEvts.length; i<len; ++i) {
                    dc.b4DragOut(e, outEvts[i].id);
                    dc.onDragOut(e, outEvts[i].id);
                }

                
                for (i=0,len=enterEvts.length; i<len; ++i) {
                    
                    dc.onDragEnter(e, enterEvts[i].id);
                }

                
                for (i=0,len=overEvts.length; i<len; ++i) {
                    dc.b4DragOver(e, overEvts[i].id);
                    dc.onDragOver(e, overEvts[i].id);
                }

                
                for (i=0, len=dropEvts.length; i<len; ++i) {
                    dc.b4DragDrop(e, dropEvts[i].id);
                    dc.onDragDrop(e, dropEvts[i].id);
                }

            }

            
            if (isDrop && !dropEvts.length) {
                dc.onInvalidDrop(e);
            }

        },

        
        getBestMatch: function(dds) {
            var winner = null;
            
            
               
            
            

            var len = dds.length;

            if (len == 1) {
                winner = dds[0];
            } else {
                
                for (var i=0; i<len; ++i) {
                    var dd = dds[i];
                    
                    
                    
                    if (dd.cursorIsOver) {
                        winner = dd;
                        break;
                    
                    } else {
                        if (!winner ||
                            winner.overlap.getArea() < dd.overlap.getArea()) {
                            winner = dd;
                        }
                    }
                }
            }

            return winner;
        },

        
        refreshCache: function(groups) {
            for (var sGroup in groups) {
                if ("string" != typeof sGroup) {
                    continue;
                }
                for (var i in this.ids[sGroup]) {
                    var oDD = this.ids[sGroup][i];

                    if (this.isTypeOfDD(oDD)) {
                    
                        var loc = this.getLocation(oDD);
                        if (loc) {
                            this.locationCache[oDD.id] = loc;
                        } else {
                            delete this.locationCache[oDD.id];
                            
                            
                            
                        }
                    }
                }
            }
        },

        
        verifyEl: function(el) {
            if (el) {
                var parent;
                if(Wtf.isIE){
                    try{
                        parent = el.offsetParent;
                    }catch(e){}
                }else{
                    parent = el.offsetParent;
                }
                if (parent) {
                    return true;
                }
            }

            return false;
        },

        
        getLocation: function(oDD) {
            if (! this.isTypeOfDD(oDD)) {
                return null;
            }

            var el = oDD.getEl(), pos, x1, x2, y1, y2, t, r, b, l;

            try {
                pos= Wtf.lib.Dom.getXY(el);
            } catch (e) { }

            if (!pos) {
                return null;
            }

            x1 = pos[0];
            x2 = x1 + el.offsetWidth;
            y1 = pos[1];
            y2 = y1 + el.offsetHeight;

            t = y1 - oDD.padding[0];
            r = x2 + oDD.padding[1];
            b = y2 + oDD.padding[2];
            l = x1 - oDD.padding[3];

            return new Wtf.lib.Region( t, r, b, l );
        },

        
        isOverTarget: function(pt, oTarget, intersect) {
            
            var loc = this.locationCache[oTarget.id];
            if (!loc || !this.useCache) {
                loc = this.getLocation(oTarget);
                this.locationCache[oTarget.id] = loc;

            }

            if (!loc) {
                return false;
            }

            oTarget.cursorIsOver = loc.contains( pt );

            
            
            
            
            
            var dc = this.dragCurrent;
            if (!dc || !dc.getTargetCoord ||
                    (!intersect && !dc.constrainX && !dc.constrainY)) {
                return oTarget.cursorIsOver;
            }

            oTarget.overlap = null;

            
            
            
            
            var pos = dc.getTargetCoord(pt.x, pt.y);

            var el = dc.getDragEl();
            var curRegion = new Wtf.lib.Region( pos.y,
                                                   pos.x + el.offsetWidth,
                                                   pos.y + el.offsetHeight,
                                                   pos.x );

            var overlap = curRegion.intersect(loc);

            if (overlap) {
                oTarget.overlap = overlap;
                return (intersect) ? true : oTarget.cursorIsOver;
            } else {
                return false;
            }
        },

        
        _onUnload: function(e, me) {
            Wtf.dd.DragDropMgr.unregAll();
        },

        
        unregAll: function() {

            if (this.dragCurrent) {
                this.stopDrag();
                this.dragCurrent = null;
            }

            this._execOnAll("unreg", []);

            for (var i in this.elementCache) {
                delete this.elementCache[i];
            }

            this.elementCache = {};
            this.ids = {};
        },

        
        elementCache: {},

        
        getElWrapper: function(id) {
            var oWrapper = this.elementCache[id];
            if (!oWrapper || !oWrapper.el) {
                oWrapper = this.elementCache[id] =
                    new this.ElementWrapper(Wtf.getDom(id));
            }
            return oWrapper;
        },

        
        getElement: function(id) {
            return Wtf.getDom(id);
        },

        
        getCss: function(id) {
            var el = Wtf.getDom(id);
            return (el) ? el.style : null;
        },

        
        ElementWrapper: function(el) {
                
                this.el = el || null;
                
                this.id = this.el && el.id;
                
                this.css = this.el && el.style;
            },

        
        getPosX: function(el) {
            return Wtf.lib.Dom.getX(el);
        },

        
        getPosY: function(el) {
            return Wtf.lib.Dom.getY(el);
        },

        
        swapNode: function(n1, n2) {
            if (n1.swapNode) {
                n1.swapNode(n2);
            } else {
                var p = n2.parentNode;
                var s = n2.nextSibling;

                if (s == n1) {
                    p.insertBefore(n1, n2);
                } else if (n2 == n1.nextSibling) {
                    p.insertBefore(n2, n1);
                } else {
                    n1.parentNode.replaceChild(n2, n1);
                    p.insertBefore(n1, s);
                }
            }
        },

        
        getScroll: function () {
            var t, l, dde=document.documentElement, db=document.body;
            if (dde && (dde.scrollTop || dde.scrollLeft)) {
                t = dde.scrollTop;
                l = dde.scrollLeft;
            } else if (db) {
                t = db.scrollTop;
                l = db.scrollLeft;
            } else {

            }
            return { top: t, left: l };
        },

        
        getStyle: function(el, styleProp) {
            return Wtf.fly(el).getStyle(styleProp);
        },

        
        getScrollTop: function () { return this.getScroll().top; },

        
        getScrollLeft: function () { return this.getScroll().left; },

        
        moveToEl: function (moveEl, targetEl) {
            var aCoord = Wtf.lib.Dom.getXY(targetEl);
            Wtf.lib.Dom.setXY(moveEl, aCoord);
        },

        
        numericSort: function(a, b) { return (a - b); },

        
        _timeoutCount: 0,

        
        _addListeners: function() {
            var DDM = Wtf.dd.DDM;
            if ( Wtf.lib.Event && document ) {
                DDM._onLoad();
            } else {
                if (DDM._timeoutCount > 2000) {
                } else {
                    setTimeout(DDM._addListeners, 10);
                    if (document && document.body) {
                        DDM._timeoutCount += 1;
                    }
                }
            }
        },

        
        handleWasClicked: function(node, id) {
            if (this.isHandle(id, node.id)) {
                return true;
            } else {
                
                var p = node.parentNode;

                while (p) {
                    if (this.isHandle(id, p.id)) {
                        return true;
                    } else {
                        p = p.parentNode;
                    }
                }
            }

            return false;
        }

    };

}();


Wtf.dd.DDM = Wtf.dd.DragDropMgr;
Wtf.dd.DDM._addListeners();

}


Wtf.dd.DD = function(id, sGroup, config) {
    if (id) {
        this.init(id, sGroup, config);
    }
};

Wtf.extend(Wtf.dd.DD, Wtf.dd.DragDrop, {

    
    scroll: true,

    
    autoOffset: function(iPageX, iPageY) {
        var x = iPageX - this.startPageX;
        var y = iPageY - this.startPageY;
        this.setDelta(x, y);
    },

    
    setDelta: function(iDeltaX, iDeltaY) {
        this.deltaX = iDeltaX;
        this.deltaY = iDeltaY;
    },

    
    setDragElPos: function(iPageX, iPageY) {
        
        

        var el = this.getDragEl();
        this.alignElWithMouse(el, iPageX, iPageY);
    },

    
    alignElWithMouse: function(el, iPageX, iPageY) {
        var oCoord = this.getTargetCoord(iPageX, iPageY);
        var fly = el.dom ? el : Wtf.fly(el, '_dd');
        if (!this.deltaSetXY) {
            var aCoord = [oCoord.x, oCoord.y];
            fly.setXY(aCoord);
            var newLeft = fly.getLeft(true);
            var newTop  = fly.getTop(true);
            this.deltaSetXY = [ newLeft - oCoord.x, newTop - oCoord.y ];
        } else {
            fly.setLeftTop(oCoord.x + this.deltaSetXY[0], oCoord.y + this.deltaSetXY[1]);
        }

        this.cachePosition(oCoord.x, oCoord.y);
        this.autoScroll(oCoord.x, oCoord.y, el.offsetHeight, el.offsetWidth);
        return oCoord;
    },

    
    cachePosition: function(iPageX, iPageY) {
        if (iPageX) {
            this.lastPageX = iPageX;
            this.lastPageY = iPageY;
        } else {
            var aCoord = Wtf.lib.Dom.getXY(this.getEl());
            this.lastPageX = aCoord[0];
            this.lastPageY = aCoord[1];
        }
    },

    
    autoScroll: function(x, y, h, w) {

        if (this.scroll) {
            
            var clientH = Wtf.lib.Dom.getViewHeight();

            
            var clientW = Wtf.lib.Dom.getViewWidth();

            
            var st = this.DDM.getScrollTop();

            
            var sl = this.DDM.getScrollLeft();

            
            var bot = h + y;

            
            var right = w + x;

            
            
            
            var toBot = (clientH + st - y - this.deltaY);

            
            var toRight = (clientW + sl - x - this.deltaX);


            
            
            var thresh = 40;

            
            
            
            var scrAmt = (document.all) ? 80 : 30;

            
            
            if ( bot > clientH && toBot < thresh ) {
                window.scrollTo(sl, st + scrAmt);
            }

            
            
            if ( y < st && st > 0 && y - st < thresh ) {
                window.scrollTo(sl, st - scrAmt);
            }

            
            
            if ( right > clientW && toRight < thresh ) {
                window.scrollTo(sl + scrAmt, st);
            }

            
            
            if ( x < sl && sl > 0 && x - sl < thresh ) {
                window.scrollTo(sl - scrAmt, st);
            }
        }
    },

    
    getTargetCoord: function(iPageX, iPageY) {


        var x = iPageX - this.deltaX;
        var y = iPageY - this.deltaY;

        if (this.constrainX) {
            if (x < this.minX) { x = this.minX; }
            if (x > this.maxX) { x = this.maxX; }
        }

        if (this.constrainY) {
            if (y < this.minY) { y = this.minY; }
            if (y > this.maxY) { y = this.maxY; }
        }

        x = this.getTick(x, this.xTicks);
        y = this.getTick(y, this.yTicks);


        return {x:x, y:y};
    },

    
    applyConfig: function() {
        Wtf.dd.DD.superclass.applyConfig.call(this);
        this.scroll = (this.config.scroll !== false);
    },

    
    b4MouseDown: function(e) {
        
        this.autoOffset(e.getPageX(),
                            e.getPageY());
    },

    
    b4Drag: function(e) {
        this.setDragElPos(e.getPageX(),
                            e.getPageY());
    },

    toString: function() {
        return ("DD " + this.id);
    }

    
    
    
    

});

Wtf.dd.DDProxy = function(id, sGroup, config) {
    if (id) {
        this.init(id, sGroup, config);
        this.initFrame();
    }
};


Wtf.dd.DDProxy.dragElId = "ygddfdiv";

Wtf.extend(Wtf.dd.DDProxy, Wtf.dd.DD, {

    
    resizeFrame: true,

    
    centerFrame: false,

    
    createFrame: function() {
        var self = this;
        var body = document.body;

        if (!body || !body.firstChild) {
            setTimeout( function() { self.createFrame(); }, 50 );
            return;
        }

        var div = this.getDragEl();

        if (!div) {
            div    = document.createElement("div");
            div.id = this.dragElId;
            var s  = div.style;

            s.position   = "absolute";
            s.visibility = "hidden";
            s.cursor     = "move";
            s.border     = "2px solid #aaa";
            s.zIndex     = 999;

            
            
            
            body.insertBefore(div, body.firstChild);
        }
    },

    
    initFrame: function() {
        this.createFrame();
    },

    applyConfig: function() {
        Wtf.dd.DDProxy.superclass.applyConfig.call(this);

        this.resizeFrame = (this.config.resizeFrame !== false);
        this.centerFrame = (this.config.centerFrame);
        this.setDragElId(this.config.dragElId || Wtf.dd.DDProxy.dragElId);
    },

    
    showFrame: function(iPageX, iPageY) {
        var el = this.getEl();
        var dragEl = this.getDragEl();
        var s = dragEl.style;

        this._resizeProxy();

        if (this.centerFrame) {
            this.setDelta( Math.round(parseInt(s.width,  10)/2),
                           Math.round(parseInt(s.height, 10)/2) );
        }

        this.setDragElPos(iPageX, iPageY);

        Wtf.fly(dragEl).show();
    },

    
    _resizeProxy: function() {
        if (this.resizeFrame) {
            var el = this.getEl();
            Wtf.fly(this.getDragEl()).setSize(el.offsetWidth, el.offsetHeight);
        }
    },

    
    b4MouseDown: function(e) {
        var x = e.getPageX();
        var y = e.getPageY();
        this.autoOffset(x, y);
        this.setDragElPos(x, y);
    },

    
    b4StartDrag: function(x, y) {
        
        this.showFrame(x, y);
    },

    
    b4EndDrag: function(e) {
        Wtf.fly(this.getDragEl()).hide();
    },

    
    
    
    endDrag: function(e) {

        var lel = this.getEl();
        var del = this.getDragEl();

        
        del.style.visibility = "";

        this.beforeMove();
        
        
        lel.style.visibility = "hidden";
        Wtf.dd.DDM.moveToEl(lel, del);
        del.style.visibility = "hidden";
        lel.style.visibility = "";

        this.afterDrag();
    },

    beforeMove : function(){

    },

    afterDrag : function(){

    },

    toString: function() {
        return ("DDProxy " + this.id);
    }

});

Wtf.dd.DDTarget = function(id, sGroup, config) {
    if (id) {
        this.initTarget(id, sGroup, config);
    }
};


Wtf.extend(Wtf.dd.DDTarget, Wtf.dd.DragDrop, {
    toString: function() {
        return ("DDTarget " + this.id);
    }
});

Wtf.dd.DragTracker = function(config){
    Wtf.apply(this, config);
    this.addEvents(
        'mousedown',
        'mouseup',
        'mousemove',
        'dragstart',
        'dragend',
        'drag'
    );

    this.dragRegion = new Wtf.lib.Region(0,0,0,0);

    if(this.el){
        this.initEl(this.el);
    }
}

Wtf.extend(Wtf.dd.DragTracker, Wtf.util.Observable,  {
    active: false,
    tolerance: 5,
    autoStart: false,

    initEl: function(el){
        this.el = Wtf.get(el);
        el.on('mousedown', this.onMouseDown, this,
                this.delegate ? {delegate: this.delegate} : undefined);
    },

    destroy : function(){
        this.el.un('mousedown', this.onMouseDown, this);
    },

    onMouseDown: function(e, target){
        if(this.fireEvent('mousedown', this, e) !== false && this.onBeforeStart(e) !== false){
            this.startXY = this.lastXY = e.getXY();
            this.dragTarget = this.delegate ? target : this.el.dom;
            e.preventDefault();
            var doc = Wtf.getDoc();
            doc.on('mouseup', this.onMouseUp, this);
            doc.on('mousemove', this.onMouseMove, this);
            doc.on('selectstart', this.stopSelect, this);
            if(this.autoStart){
                this.timer = this.triggerStart.defer(this.autoStart === true ? 1000 : this.autoStart, this);
            }
        }
    },

    onMouseMove: function(e, target){
        e.preventDefault();
        var xy = e.getXY(), s = this.startXY;
        this.lastXY = xy;
        if(!this.active){
            if(Math.abs(s[0]-xy[0]) > this.tolerance || Math.abs(s[1]-xy[1]) > this.tolerance){
                this.triggerStart();
            }else{
                return;
            }
        }
        this.fireEvent('mousemove', this, e);
        this.onDrag(e);
        this.fireEvent('drag', this, e);
    },

    onMouseUp: function(e){
        var doc = Wtf.getDoc();
        doc.un('mousemove', this.onMouseMove, this);
        doc.un('mouseup', this.onMouseUp, this);
        doc.un('selectstart', this.stopSelect, this);
        e.preventDefault();
        this.clearStart();
        this.active = false;
        delete this.elRegion;
        this.fireEvent('mouseup', this, e);
        this.onEnd(e);
        this.fireEvent('dragend', this, e);
    },

    triggerStart: function(isTimer){
        this.clearStart();
        this.active = true;
        this.onStart(this.startXY);
        this.fireEvent('dragstart', this, this.startXY);
    },

    clearStart : function(){
        if(this.timer){
            clearTimeout(this.timer);
            delete this.timer;
        }
    },

    stopSelect : function(e){
        e.stopEvent();
        return false;
    },

    onBeforeStart : function(e){

    },

    onStart : function(xy){

    },

    onDrag : function(e){

    },

    onEnd : function(e){

    },

    getDragTarget : function(){
        return this.dragTarget;
    },

    getDragCt : function(){
        return this.el;
    },

    getXY : function(constrain){
        return constrain ?
               this.constrainModes[constrain].call(this, this.lastXY) : this.lastXY;
    },

    getOffset : function(constrain){
        var xy = this.getXY(constrain);
        var s = this.startXY;
        return [s[0]-xy[0], s[1]-xy[1]];
    },

    constrainModes: {
        'point' : function(xy){

            if(!this.elRegion){
                this.elRegion = this.getDragCt().getRegion();
            }

            var dr = this.dragRegion;

            dr.left = xy[0];
            dr.top = xy[1];
            dr.right = xy[0];
            dr.bottom = xy[1];

            dr.constrainTo(this.elRegion);

            return [dr.left, dr.top];
        }
    }
});

Wtf.dd.ScrollManager = function(){
    var ddm = Wtf.dd.DragDropMgr;
    var els = {};
    var dragEl = null;
    var proc = {};
    
    var onStop = function(e){
        dragEl = null;
        clearProc();
    };
    
    var triggerRefresh = function(){
        if(ddm.dragCurrent){
             ddm.refreshCache(ddm.dragCurrent.groups);
        }
    };
    
    var doScroll = function(){
        if(ddm.dragCurrent){
            var dds = Wtf.dd.ScrollManager;
            var inc = proc.el.ddScrollConfig ?
                      proc.el.ddScrollConfig.increment : dds.increment;
            if(!dds.animate){
                if(proc.el.scroll(proc.dir, inc)){
                    triggerRefresh();
                }
            }else{
                proc.el.scroll(proc.dir, inc, true, dds.animDuration, triggerRefresh);
            }
        }
    };
    
    var clearProc = function(){
        if(proc.id){
            clearInterval(proc.id);
        }
        proc.id = 0;
        proc.el = null;
        proc.dir = "";
    };
    
    var startProc = function(el, dir){
        clearProc();
        proc.el = el;
        proc.dir = dir;
        proc.id = setInterval(doScroll, Wtf.dd.ScrollManager.frequency);
    };
    
    var onFire = function(e, isDrop){
        if(isDrop || !ddm.dragCurrent){ return; }
        var dds = Wtf.dd.ScrollManager;
        if(!dragEl || dragEl != ddm.dragCurrent){
            dragEl = ddm.dragCurrent;
            
            dds.refreshCache();
        }
        
        var xy = Wtf.lib.Event.getXY(e);
        var pt = new Wtf.lib.Point(xy[0], xy[1]);
        for(var id in els){
            var el = els[id], r = el._region;
            var c = el.ddScrollConfig ? el.ddScrollConfig : dds;
            if(r && r.contains(pt) && el.isScrollable()){
                if(r.bottom - pt.y <= c.vthresh){
                    if(proc.el != el){
                        startProc(el, "down");
                    }
                    return;
                }else if(r.right - pt.x <= c.hthresh){
                    if(proc.el != el){
                        startProc(el, "left");
                    }
                    return;
                }else if(pt.y - r.top <= c.vthresh){
                    if(proc.el != el){
                        startProc(el, "up");
                    }
                    return;
                }else if(pt.x - r.left <= c.hthresh){
                    if(proc.el != el){
                        startProc(el, "right");
                    }
                    return;
                }
            }
        }
        clearProc();
    };
    
    ddm.fireEvents = ddm.fireEvents.createSequence(onFire, ddm);
    ddm.stopDrag = ddm.stopDrag.createSequence(onStop, ddm);
    
    return {
        
        register : function(el){
            if(el instanceof Array){
                for(var i = 0, len = el.length; i < len; i++) {
                	this.register(el[i]);
                }
            }else{
                el = Wtf.get(el);
                els[el.id] = el;
            }
        },
        
        
        unregister : function(el){
            if(el instanceof Array){
                for(var i = 0, len = el.length; i < len; i++) {
                	this.unregister(el[i]);
                }
            }else{
                el = Wtf.get(el);
                delete els[el.id];
            }
        },
        
        
        vthresh : 25,
        
        hthresh : 25,

        
        increment : 100,
        
        
        frequency : 500,
        
        
        animate: true,
        
        
        animDuration: .4,
        
        
        refreshCache : function(){
            for(var id in els){
                if(typeof els[id] == 'object'){ 
                    els[id]._region = els[id].getRegion();
                }
            }
        }
    };
}();

Wtf.dd.Registry = function(){
    var elements = {}; 
    var handles = {}; 
    var autoIdSeed = 0;

    var getId = function(el, autogen){
        if(typeof el == "string"){
            return el;
        }
        var id = el.id;
        if(!id && autogen !== false){
            id = "extdd-" + (++autoIdSeed);
            el.id = id;
        }
        return id;
    };
    
    return {
    
        register : function(el, data){
            data = data || {};
            if(typeof el == "string"){
                el = document.getElementById(el);
            }
            data.ddel = el;
            elements[getId(el)] = data;
            if(data.isHandle !== false){
                handles[data.ddel.id] = data;
            }
            if(data.handles){
                var hs = data.handles;
                for(var i = 0, len = hs.length; i < len; i++){
                	handles[getId(hs[i])] = data;
                }
            }
        },

    
        unregister : function(el){
            var id = getId(el, false);
            var data = elements[id];
            if(data){
                delete elements[id];
                if(data.handles){
                    var hs = data.handles;
                    for(var i = 0, len = hs.length; i < len; i++){
                    	delete handles[getId(hs[i], false)];
                    }
                }
            }
        },

    
        getHandle : function(id){
            if(typeof id != "string"){ 
                id = id.id;
            }
            return handles[id];
        },

    
        getHandleFromEvent : function(e){
            var t = Wtf.lib.Event.getTarget(e);
            return t ? handles[t.id] : null;
        },

    
        getTarget : function(id){
            if(typeof id != "string"){ 
                id = id.id;
            }
            return elements[id];
        },

    
        getTargetFromEvent : function(e){
            var t = Wtf.lib.Event.getTarget(e);
            return t ? elements[t.id] || handles[t.id] : null;
        }
    };
}();

Wtf.dd.StatusProxy = function(config){
    Wtf.apply(this, config);
    this.id = this.id || Wtf.id();
    this.el = new Wtf.Layer({
        dh: {
            id: this.id, tag: "div", cls: "x-dd-drag-proxy "+this.dropNotAllowed, children: [
                {tag: "div", cls: "x-dd-drop-icon"},
                {tag: "div", cls: "x-dd-drag-ghost"}
            ]
        }, 
        shadow: !config || config.shadow !== false
    });
    this.ghost = Wtf.get(this.el.dom.childNodes[1]);
    this.dropStatus = this.dropNotAllowed;
};

Wtf.dd.StatusProxy.prototype = {
    
    dropAllowed : "x-dd-drop-ok",
    
    dropNotAllowed : "x-dd-drop-nodrop",

    
    setStatus : function(cssClass){
        cssClass = cssClass || this.dropNotAllowed;
        if(this.dropStatus != cssClass){
            this.el.replaceClass(this.dropStatus, cssClass);
            this.dropStatus = cssClass;
        }
    },

    
    reset : function(clearGhost){
        this.el.dom.className = "x-dd-drag-proxy " + this.dropNotAllowed;
        this.dropStatus = this.dropNotAllowed;
        if(clearGhost){
            this.ghost.update("");
        }
    },

    
    update : function(html){
        if(typeof html == "string"){
            this.ghost.update(html);
        }else{
            this.ghost.update("");
            html.style.margin = "0";
            this.ghost.dom.appendChild(html);
        }        
    },

    
    getEl : function(){
        return this.el;
    },

    
    getGhost : function(){
        return this.ghost;
    },

    
    hide : function(clear){
        this.el.hide();
        if(clear){
            this.reset(true);
        }
    },

    
    stop : function(){
        if(this.anim && this.anim.isAnimated && this.anim.isAnimated()){
            this.anim.stop();
        }
    },

    
    show : function(){
        this.el.show();
    },

    
    sync : function(){
        this.el.sync();
    },

    
    repair : function(xy, callback, scope){
        this.callback = callback;
        this.scope = scope;
        if(xy && this.animRepair !== false){
            this.el.addClass("x-dd-drag-repair");
            this.el.hideUnders(true);
            this.anim = this.el.shift({
                duration: this.repairDuration || .5,
                easing: 'easeOut',
                xy: xy,
                stopFx: true,
                callback: this.afterRepair,
                scope: this
            });
        }else{
            this.afterRepair();
        }
    },

    
    afterRepair : function(){
        this.hide(true);
        if(typeof this.callback == "function"){
            this.callback.call(this.scope || this);
        }
        this.callback = null;
        this.scope = null;
    }
};

Wtf.dd.DragSource = function(el, config){
    this.el = Wtf.get(el);
    if(!this.dragData){
        this.dragData = {};
    }
    
    Wtf.apply(this, config);
    
    if(!this.proxy){
        this.proxy = new Wtf.dd.StatusProxy();
    }
    Wtf.dd.DragSource.superclass.constructor.call(this, this.el.dom, this.ddGroup || this.group, 
          {dragElId : this.proxy.id, resizeFrame: false, isTarget: false, scroll: this.scroll === true});
    
    this.dragging = false;
};

Wtf.extend(Wtf.dd.DragSource, Wtf.dd.DDProxy, {
    
    
    dropAllowed : "x-dd-drop-ok",
    
    dropNotAllowed : "x-dd-drop-nodrop",

    
    getDragData : function(e){
        return this.dragData;
    },

    
    onDragEnter : function(e, id){
        var target = Wtf.dd.DragDropMgr.getDDById(id);
        this.cachedTarget = target;
        if(this.beforeDragEnter(target, e, id) !== false){
            if(target.isNotifyTarget){
                var status = target.notifyEnter(this, e, this.dragData);
                this.proxy.setStatus(status);
            }else{
                this.proxy.setStatus(this.dropAllowed);
            }
            
            if(this.afterDragEnter){
                
                this.afterDragEnter(target, e, id);
            }
        }
    },

    
    beforeDragEnter : function(target, e, id){
        return true;
    },

    
    alignElWithMouse: function() {
        Wtf.dd.DragSource.superclass.alignElWithMouse.apply(this, arguments);
        this.proxy.sync();
    },

    
    onDragOver : function(e, id){
        var target = this.cachedTarget || Wtf.dd.DragDropMgr.getDDById(id);
        if(this.beforeDragOver(target, e, id) !== false){
            if(target.isNotifyTarget){
                var status = target.notifyOver(this, e, this.dragData);
                this.proxy.setStatus(status);
            }

            if(this.afterDragOver){
                
                this.afterDragOver(target, e, id);
            }
        }
    },

    
    beforeDragOver : function(target, e, id){
        return true;
    },

    
    onDragOut : function(e, id){
        var target = this.cachedTarget || Wtf.dd.DragDropMgr.getDDById(id);
        if(this.beforeDragOut(target, e, id) !== false){
            if(target.isNotifyTarget){
                target.notifyOut(this, e, this.dragData);
            }
            this.proxy.reset();
            if(this.afterDragOut){
                
                this.afterDragOut(target, e, id);
            }
        }
        this.cachedTarget = null;
    },

    
    beforeDragOut : function(target, e, id){
        return true;
    },
    
    
    onDragDrop : function(e, id){
        var target = this.cachedTarget || Wtf.dd.DragDropMgr.getDDById(id);
        if(this.beforeDragDrop(target, e, id) !== false){
            if(target.isNotifyTarget){
                if(target.notifyDrop(this, e, this.dragData)){ 
                    this.onValidDrop(target, e, id);
                }else{
                    this.onInvalidDrop(target, e, id);
                }
            }else{
                this.onValidDrop(target, e, id);
            }
            
            if(this.afterDragDrop){
                
                this.afterDragDrop(target, e, id);
            }
        }
        delete this.cachedTarget;
    },

    
    beforeDragDrop : function(target, e, id){
        return true;
    },

    
    onValidDrop : function(target, e, id){
        this.hideProxy();
        if(this.afterValidDrop){
            
            this.afterValidDrop(target, e, id);
        }
    },

    
    getRepairXY : function(e, data){
        return this.el.getXY();  
    },

    
    onInvalidDrop : function(target, e, id){
        this.beforeInvalidDrop(target, e, id);
        if(this.cachedTarget){
            if(this.cachedTarget.isNotifyTarget){
                this.cachedTarget.notifyOut(this, e, this.dragData);
            }
            this.cacheTarget = null;
        }
        this.proxy.repair(this.getRepairXY(e, this.dragData), this.afterRepair, this);

        if(this.afterInvalidDrop){
            
            this.afterInvalidDrop(e, id);
        }
    },

    
    afterRepair : function(){
        if(Wtf.enableFx){
            this.el.highlight(this.hlColor || "c3daf9");
        }
        this.dragging = false;
    },

    
    beforeInvalidDrop : function(target, e, id){
        return true;
    },

    
    handleMouseDown : function(e){
        if(this.dragging) {
            return;
        }
        var data = this.getDragData(e);
        if(data && this.onBeforeDrag(data, e) !== false){
            this.dragData = data;
            this.proxy.stop();
            Wtf.dd.DragSource.superclass.handleMouseDown.apply(this, arguments);
        } 
    },

    
    onBeforeDrag : function(data, e){
        return true;
    },

    
    onStartDrag : Wtf.emptyFn,

    
    startDrag : function(x, y){
        this.proxy.reset();
        this.dragging = true;
        this.proxy.update("");
        this.onInitDrag(x, y);
        this.proxy.show();
    },

    
    onInitDrag : function(x, y){
        var clone = this.el.dom.cloneNode(true);
        clone.id = Wtf.id(); 
        this.proxy.update(clone);
        this.onStartDrag(x, y);
        return true;
    },

    
    getProxy : function(){
        return this.proxy;  
    },

    
    hideProxy : function(){
        this.proxy.hide();  
        this.proxy.reset(true);
        this.dragging = false;
    },

    
    triggerCacheRefresh : function(){
        Wtf.dd.DDM.refreshCache(this.groups);
    },

    
    b4EndDrag: function(e) {
    },

    
    endDrag : function(e){
        this.onEndDrag(this.dragData, e);
    },

    
    onEndDrag : function(data, e){
    },
    
    
    autoOffset : function(x, y) {
        this.setDelta(-12, -20);
    }    
});

Wtf.dd.DropTarget = function(el, config){
    this.el = Wtf.get(el);
    
    Wtf.apply(this, config);
    
    if(this.containerScroll){
        Wtf.dd.ScrollManager.register(this.el);
    }
    
    Wtf.dd.DropTarget.superclass.constructor.call(this, this.el.dom, this.ddGroup || this.group, 
          {isTarget: true});

};

Wtf.extend(Wtf.dd.DropTarget, Wtf.dd.DDTarget, {
    
    
    
    dropAllowed : "x-dd-drop-ok",
    
    dropNotAllowed : "x-dd-drop-nodrop",

    
    isTarget : true,

    
    isNotifyTarget : true,

    
    notifyEnter : function(dd, e, data){
        if(this.overClass){
            this.el.addClass(this.overClass);
        }
        return this.dropAllowed;
    },

    
    notifyOver : function(dd, e, data){
        return this.dropAllowed;
    },

    
    notifyOut : function(dd, e, data){
        if(this.overClass){
            this.el.removeClass(this.overClass);
        }
    },

    
    notifyDrop : function(dd, e, data){
        return false;
    }
});

Wtf.dd.DragZone = function(el, config){
    Wtf.dd.DragZone.superclass.constructor.call(this, el, config);
    if(this.containerScroll){
        Wtf.dd.ScrollManager.register(this.el);
    }
};

Wtf.extend(Wtf.dd.DragZone, Wtf.dd.DragSource, {
    
    

    
    getDragData : function(e){
        return Wtf.dd.Registry.getHandleFromEvent(e);
    },
    
    
    onInitDrag : function(x, y){
        this.proxy.update(this.dragData.ddel.cloneNode(true));
        this.onStartDrag(x, y);
        return true;
    },
    
    
    afterRepair : function(){
        if(Wtf.enableFx){
            Wtf.Element.fly(this.dragData.ddel).highlight(this.hlColor || "c3daf9");
        }
        this.dragging = false;
    },

    
    getRepairXY : function(e){
        return Wtf.Element.fly(this.dragData.ddel).getXY();  
    }
});

Wtf.dd.DropZone = function(el, config){
    Wtf.dd.DropZone.superclass.constructor.call(this, el, config);
};

Wtf.extend(Wtf.dd.DropZone, Wtf.dd.DropTarget, {
    
    getTargetFromEvent : function(e){
        return Wtf.dd.Registry.getTargetFromEvent(e);
    },

    
    onNodeEnter : function(n, dd, e, data){
        
    },

    
    onNodeOver : function(n, dd, e, data){
        return this.dropAllowed;
    },

    
    onNodeOut : function(n, dd, e, data){
        
    },

    
    onNodeDrop : function(n, dd, e, data){
        return false;
    },

    
    onContainerOver : function(dd, e, data){
        return this.dropNotAllowed;
    },

    
    onContainerDrop : function(dd, e, data){
        return false;
    },

    
    notifyEnter : function(dd, e, data){
        return this.dropNotAllowed;
    },

    
    notifyOver : function(dd, e, data){
        var n = this.getTargetFromEvent(e);
        if(!n){ 
            if(this.lastOverNode){
                this.onNodeOut(this.lastOverNode, dd, e, data);
                this.lastOverNode = null;
            }
            return this.onContainerOver(dd, e, data);
        }
        if(this.lastOverNode != n){
            if(this.lastOverNode){
                this.onNodeOut(this.lastOverNode, dd, e, data);
            }
            this.onNodeEnter(n, dd, e, data);
            this.lastOverNode = n;
        }
        return this.onNodeOver(n, dd, e, data);
    },

    
    notifyOut : function(dd, e, data){
        if(this.lastOverNode){
            this.onNodeOut(this.lastOverNode, dd, e, data);
            this.lastOverNode = null;
        }
    },

    
    notifyDrop : function(dd, e, data){
        if(this.lastOverNode){
            this.onNodeOut(this.lastOverNode, dd, e, data);
            this.lastOverNode = null;
        }
        var n = this.getTargetFromEvent(e);
        return n ?
            this.onNodeDrop(n, dd, e, data) :
            this.onContainerDrop(dd, e, data);
    },

    
    triggerCacheRefresh : function(){
        Wtf.dd.DDM.refreshCache(this.groups);
    }  
});


Wtf.data.SortTypes = {
    
    none : function(s){
        return s;
    },
    
    
    stripTagsRE : /<\/?[^>]+>/gi,
    
    
    asText : function(s){
        return String(s).replace(this.stripTagsRE, "");
    },
    
    
    asUCText : function(s){
        return String(s).toUpperCase().replace(this.stripTagsRE, "");
    },
    
    
    asUCString : function(s) {
    	return String(s).toUpperCase();
    },
    
    
    asDate : function(s) {
        if(!s){
            return 0;
        }
        if(s instanceof Date){
            return s.getTime();
        }
    	return Date.parse(String(s));
    },
    
    
    asFloat : function(s) {
    	var val = parseFloat(String(s).replace(/,/g, ""));
        if(isNaN(val)) val = 0;
    	return val;
    },
    
    
    asInt : function(s) {
        var val = parseInt(String(s).replace(/,/g, ""));
        if(isNaN(val)) val = 0;
    	return val;
    }
};

Wtf.data.Record = function(data, id){
    this.id = (id || id === 0) ? id : ++Wtf.data.Record.AUTO_ID;
    this.data = data;
};


Wtf.data.Record.create = function(o){
    var f = Wtf.extend(Wtf.data.Record, {});
    var p = f.prototype;
    p.fields = new Wtf.util.MixedCollection(false, function(field){
        return field.name;
    });
    for(var i = 0, len = o.length; i < len; i++){
        p.fields.add(new Wtf.data.Field(o[i]));
    }
    f.getField = function(name){
        return p.fields.get(name);  
    };
    return f;
};

Wtf.data.Record.AUTO_ID = 1000;
Wtf.data.Record.EDIT = 'edit';
Wtf.data.Record.REJECT = 'reject';
Wtf.data.Record.COMMIT = 'commit';

Wtf.data.Record.prototype = {
	
    
    
    dirty : false,
    editing : false,
    error: null,
    
    modified: null,

    
    join : function(store){
        this.store = store;
    },

    
    set : function(name, value){
        if(String(this.data[name]) == String(value)){
            return;
        }
        this.dirty = true;
        if(!this.modified){
            this.modified = {};
        }
        if(typeof this.modified[name] == 'undefined'){
            this.modified[name] = this.data[name];
        }
        this.data[name] = value;
        if(!this.editing){
            this.store.afterEdit(this);
        }       
    },

    
    get : function(name){
        return this.data[name]; 
    },

    
    beginEdit : function(){
        this.editing = true;
        this.modified = {}; 
    },

    
    cancelEdit : function(){
        this.editing = false;
        delete this.modified;
    },

    
    endEdit : function(){
        this.editing = false;
        if(this.dirty && this.store){
            this.store.afterEdit(this);
        }
    },

    
    reject : function(silent){
        var m = this.modified;
        for(var n in m){
            if(typeof m[n] != "function"){
                this.data[n] = m[n];
            }
        }
        this.dirty = false;
        delete this.modified;
        this.editing = false;
        if(this.store && silent !== true){
            this.store.afterReject(this);
        }
    },

    
    commit : function(silent){
        this.dirty = false;
        delete this.modified;
        this.editing = false;
        if(this.store && silent !== true){
            this.store.afterCommit(this);
        }
    },

    
    getChanges : function(){
        var m = this.modified, cs = {};
        for(var n in m){
            if(m.hasOwnProperty(n)){
                cs[n] = this.data[n];
            }
        }
        return cs;
    },

    
    hasError : function(){
        return this.error != null;
    },

    
    clearError : function(){
        this.error = null;
    },

    
    copy : function(newId) {
        return new this.constructor(Wtf.apply({}, this.data), newId || this.id);
    }
};

Wtf.StoreMgr = Wtf.apply(new Wtf.util.MixedCollection(), {
    register : function(){
        for(var i = 0, s; s = arguments[i]; i++){
            this.add(s);
        }
    },

    unregister : function(){
        for(var i = 0, s; s = arguments[i]; i++){
            this.remove(this.lookup(s));
        }
    },

    
    lookup : function(id){
        return typeof id == "object" ? id : this.get(id);
    },

    
    getKey : function(o){
         return o.storeId || o.id; 
    }
});

Wtf.data.Store = function(config){
    this.data = new Wtf.util.MixedCollection(false);
    this.data.getKey = function(o){
        return o.id;
    };
    
    this.baseParams = {};
    
    this.paramNames = {
        "start" : "start",
        "limit" : "limit",
        "sort" : "sort",
        "dir" : "dir"
    };

    if(config && config.data){
        this.inlineData = config.data;
        delete config.data;
    }

    Wtf.apply(this, config);

    if(this.url && !this.proxy){
        this.proxy = new Wtf.data.HttpProxy({url: this.url});
    }

    if(this.reader){ 
        if(!this.recordType){
            this.recordType = this.reader.recordType;
        }
        if(this.reader.onMetaChange){
            this.reader.onMetaChange = this.onMetaChange.createDelegate(this);
        }
    }

    if(this.recordType){
        this.fields = this.recordType.prototype.fields;
    }
    this.modified = [];

    this.addEvents(
        
        'datachanged',
        
        'metachange',
        
        'add',
        
        'remove',
        
        'update',
        
        'clear',
        
        'beforeload',
        
        'load',
        
        'loadexception'
    );

    if(this.proxy){
        this.relayEvents(this.proxy,  ["loadexception"]);
    }
    this.sortToggle = {};

    Wtf.data.Store.superclass.constructor.call(this);

    if(this.storeId || this.id){
        Wtf.StoreMgr.register(this);
    }
    if(this.inlineData){
        this.loadData(this.inlineData);
        delete this.inlineData;
    }else if(this.autoLoad){
        this.load.defer(10, this, [
            typeof this.autoLoad == 'object' ?
                this.autoLoad : undefined]);
    }
};
Wtf.extend(Wtf.data.Store, Wtf.util.Observable, {
    
    
    
    
    
    
    
    
    
    remoteSort : false,

    
    pruneModifiedRecords : false,

    
   lastOptions : null,

    destroy : function(){
        if(this.id){
            Wtf.StoreMgr.unregister(this);
        }
        this.data = null;
        this.purgeListeners();
    },

    
    add : function(records){
        records = [].concat(records);
        if(records.length < 1){
            return;
        }
        for(var i = 0, len = records.length; i < len; i++){
            records[i].join(this);
        }
        var index = this.data.length;
        this.data.addAll(records);
        if(this.snapshot){
            this.snapshot.addAll(records);
        }
        this.fireEvent("add", this, records, index);
    },

    
    addSorted : function(record){
        var index = this.findInsertIndex(record);
        this.insert(index, record);
    },

    
    remove : function(record){
        var index = this.data.indexOf(record);
        this.data.removeAt(index);
        if(this.pruneModifiedRecords){
            this.modified.remove(record);
        }
        if(this.snapshot){
            this.snapshot.remove(record);
        }
        this.fireEvent("remove", this, record, index);
    },

    
    removeAll : function(){
        this.data.clear();
        if(this.snapshot){
            this.snapshot.clear();
        }
        if(this.pruneModifiedRecords){
            this.modified = [];
        }
        this.fireEvent("clear", this);
    },

    
    insert : function(index, records){
        records = [].concat(records);
        for(var i = 0, len = records.length; i < len; i++){
            this.data.insert(index, records[i]);
            records[i].join(this);
        }
        this.fireEvent("add", this, records, index);
    },

    
    indexOf : function(record){
        return this.data.indexOf(record);
    },

    
    indexOfId : function(id){
        return this.data.indexOfKey(id);
    },

    
    getById : function(id){
        return this.data.key(id);
    },

    
    getAt : function(index){
        return this.data.itemAt(index);
    },

    
    getRange : function(start, end){
        return this.data.getRange(start, end);
    },

    
    storeOptions : function(o){
        o = Wtf.apply({}, o);
        delete o.callback;
        delete o.scope;
        this.lastOptions = o;
    },

    
    load : function(options){
        options = options || {};
        if(this.fireEvent("beforeload", this, options) !== false){
            this.storeOptions(options);
            var p = Wtf.apply(options.params || {}, this.baseParams);
            if(this.sortInfo && this.remoteSort){
                var pn = this.paramNames;
                p[pn["sort"]] = this.sortInfo.field;
                p[pn["dir"]] = this.sortInfo.direction;
            }
            this.proxy.load(p, this.reader, this.loadRecords, this, options);
        }
    },

    
    reload : function(options){
        this.load(Wtf.applyIf(options||{}, this.lastOptions));
    },

    
    
    loadRecords : function(o, options, success){
        if(!o || success === false){
            if(success !== false){
                this.fireEvent("load", this, [], options);
            }
            if(options.callback){
                options.callback.call(options.scope || this, [], options, false);
            }
            return;
        }
        var r = o.records, t = o.totalRecords || r.length;
        if(!options || options.add !== true){
            if(this.pruneModifiedRecords){
                this.modified = [];
            }
            for(var i = 0, len = r.length; i < len; i++){
                r[i].join(this);
            }
            if(this.snapshot){
                this.data = this.snapshot;
                delete this.snapshot;
            }
            this.data.clear();
            this.data.addAll(r);
            this.totalLength = t;
            this.applySort();
            this.fireEvent("datachanged", this);
        }else{
            this.totalLength = Math.max(t, this.data.length+r.length);
            this.add(r);
        }
        this.fireEvent("load", this, r, options);
        if(options.callback){
            options.callback.call(options.scope || this, r, options, true);
        }
    },

    
    loadData : function(o, append){
        var r = this.reader.readRecords(o);
        this.loadRecords(r, {add: append}, true);
    },

    
    getCount : function(){
        return this.data.length || 0;
    },

    
    getTotalCount : function(){
        return this.totalLength || 0;
    },

    
    getSortState : function(){
        return this.sortInfo;
    },

    
    applySort : function(){
        if(this.sortInfo && !this.remoteSort){
            var s = this.sortInfo, f = s.field;
            this.sortData(f, s.direction);
        }
    },

    
    sortData : function(f, direction){
        direction = direction || 'ASC';
        var st = this.fields.get(f).sortType;
        var fn = function(r1, r2){
            var v1 = st(r1.data[f]), v2 = st(r2.data[f]);
            return v1 > v2 ? 1 : (v1 < v2 ? -1 : 0);
        };
        this.data.sort(direction, fn);
        if(this.snapshot && this.snapshot != this.data){
            this.snapshot.sort(direction, fn);
        }
    },

    
    setDefaultSort : function(field, dir){
        dir = dir ? dir.toUpperCase() : "ASC";
        this.sortInfo = {field: field, direction: dir};
        this.sortToggle[field] = dir;
    },

    
    sort : function(fieldName, dir){
        var f = this.fields.get(fieldName);
        if(!f){
            return false;
        }
        if(!dir){
            if(this.sortInfo && this.sortInfo.field == f.name){ 
                dir = (this.sortToggle[f.name] || "ASC").toggle("ASC", "DESC");
            }else{
                dir = f.sortDir;
            }
        }
        this.sortToggle[f.name] = dir;
        this.sortInfo = {field: f.name, direction: dir};
        if(!this.remoteSort){
            this.applySort();
            this.fireEvent("datachanged", this);
        }else{
            this.load(this.lastOptions);
        }
    },

    
    each : function(fn, scope){
        this.data.each(fn, scope);
    },

    
    getModifiedRecords : function(){
        return this.modified;
    },

    
    createFilterFn : function(property, value, anyMatch, caseSensitive){
        if(Wtf.isEmpty(value, false)){
            return false;
        }
        value = this.data.createValueMatcher(value, anyMatch, caseSensitive);
        return function(r){
            return value.test(r.data[property]);
        };
    },

    
    sum : function(property, start, end){
        var rs = this.data.items, v = 0;
        start = start || 0;
        end = (end || end === 0) ? end : rs.length-1;

        for(var i = start; i <= end; i++){
            v += (rs[i].data[property] || 0);
        }
        return v;
    },

    
    filter : function(property, value, anyMatch, caseSensitive){
        var fn = this.createFilterFn(property, value, anyMatch, caseSensitive);
        return fn ? this.filterBy(fn) : this.clearFilter();
    },

    
    filterBy : function(fn, scope){
        this.snapshot = this.snapshot || this.data;
        this.data = this.queryBy(fn, scope||this);
        this.fireEvent("datachanged", this);
    },

    
    query : function(property, value, anyMatch, caseSensitive){
        var fn = this.createFilterFn(property, value, anyMatch, caseSensitive);
        return fn ? this.queryBy(fn) : this.data.clone();
    },

    
    queryBy : function(fn, scope){
        var data = this.snapshot || this.data;
        return data.filterBy(fn, scope||this);
    },

    
    find : function(property, value, start, anyMatch, caseSensitive){
        var fn = this.createFilterFn(property, value, anyMatch, caseSensitive);
        return fn ? this.data.findIndexBy(fn, null, start) : -1;
    },

    
    findBy : function(fn, scope, start){
        return this.data.findIndexBy(fn, scope, start);
    },

    
    collect : function(dataIndex, allowNull, bypassFilter){
        var d = (bypassFilter === true && this.snapshot) ?
                this.snapshot.items : this.data.items;
        var v, sv, r = [], l = {};
        for(var i = 0, len = d.length; i < len; i++){
            v = d[i].data[dataIndex];
            sv = String(v);
            if((allowNull || !Wtf.isEmpty(v)) && !l[sv]){
                l[sv] = true;
                r[r.length] = v;
            }
        }
        return r;
    },

    
    clearFilter : function(suppressEvent){
        if(this.isFiltered()){
            this.data = this.snapshot;
            delete this.snapshot;
            if(suppressEvent !== true){
                this.fireEvent("datachanged", this);
            }
        }
    },

    
    isFiltered : function(){
        return this.snapshot && this.snapshot != this.data;
    },

    
    afterEdit : function(record){
        if(this.modified.indexOf(record) == -1){
            this.modified.push(record);
        }
        this.fireEvent("update", this, record, Wtf.data.Record.EDIT);
    },

    
    afterReject : function(record){
        this.modified.remove(record);
        this.fireEvent("update", this, record, Wtf.data.Record.REJECT);
    },

    
    afterCommit : function(record){
        this.modified.remove(record);
        this.fireEvent("update", this, record, Wtf.data.Record.COMMIT);
    },

    
    commitChanges : function(){
        var m = this.modified.slice(0);
        this.modified = [];
        for(var i = 0, len = m.length; i < len; i++){
            m[i].commit();
        }
    },

    
    rejectChanges : function(){
        var m = this.modified.slice(0);
        this.modified = [];
        for(var i = 0, len = m.length; i < len; i++){
            m[i].reject();
        }
    },

    
    onMetaChange : function(meta, rtype, o){
        this.recordType = rtype;
        this.fields = rtype.prototype.fields;
        delete this.snapshot;
        this.sortInfo = meta.sortInfo;
        this.modified = [];
        this.fireEvent('metachange', this, this.reader.meta);
    },

    
    findInsertIndex : function(record){
        this.suspendEvents();
        var data = this.data.clone();
        this.data.add(record);
        this.applySort();
        var index = this.data.indexOf(record);
        this.data = data;
        this.resumeEvents();
        return index;
    }
});

Wtf.data.SimpleStore = function(config){
    Wtf.data.SimpleStore.superclass.constructor.call(this, Wtf.apply(config, {
        reader: new Wtf.data.ArrayReader({
                id: config.id
            },
            Wtf.data.Record.create(config.fields)
        )
    }));
};
Wtf.extend(Wtf.data.SimpleStore, Wtf.data.Store, {
    loadData : function(data, append){
        if(this.expandData === true){
            var r = [];
            for(var i = 0, len = data.length; i < len; i++){
                r[r.length] = [data[i]];
            }
            data = r;
        }
        Wtf.data.SimpleStore.superclass.loadData.call(this, data, append);
    }
});

Wtf.data.JsonStore = function(c){
    Wtf.data.JsonStore.superclass.constructor.call(this, Wtf.apply(c, {
        proxy: !c.data ? new Wtf.data.HttpProxy({url: c.url}) : undefined,
        reader: new Wtf.data.JsonReader(c, c.fields)
    }));
};
Wtf.extend(Wtf.data.JsonStore, Wtf.data.Store);



Wtf.data.Field = function(config){
    if(typeof config == "string"){
        config = {name: config};
    }
    Wtf.apply(this, config);
    
    if(!this.type){
        this.type = "auto";
    }
    
    var st = Wtf.data.SortTypes;
    
    if(typeof this.sortType == "string"){
        this.sortType = st[this.sortType];
    }
    
    
    if(!this.sortType){
        switch(this.type){
            case "string":
                this.sortType = st.asUCString;
                break;
            case "date":
                this.sortType = st.asDate;
                break;
            default:
                this.sortType = st.none;
        }
    }

    
    var stripRe = /[\$,%]/g;

    
    
    if(!this.convert){
        var cv, dateFormat = this.dateFormat;
        switch(this.type){
            case "":
            case "auto":
            case undefined:
                cv = function(v){ return v; };
                break;
            case "string":
                cv = function(v){ return (v === undefined || v === null) ? '' : String(v); };
                break;
            case "int":
                cv = function(v){
                    return v !== undefined && v !== null && v !== '' ?
                           parseInt(String(v).replace(stripRe, ""), 10) : '';
                    };
                break;
            case "float":
                cv = function(v){
                    return v !== undefined && v !== null && v !== '' ?
                           parseFloat(String(v).replace(stripRe, ""), 10) : ''; 
                    };
                break;
            case "bool":
            case "boolean":
                cv = function(v){ return v === true || v === "true" || v == 1; };
                break;
            case "date":
                cv = function(v){
                    if(!v){
                        return '';
                    }
                    if(v instanceof Date){
                        return v;
                    }
                    if(dateFormat){
                        if(dateFormat == "timestamp"){
                            return new Date(v*1000);
                        }
                        if(dateFormat == "time"){
                            return new Date(parseInt(v, 10));
                        }
                        return Date.parseDate(v, dateFormat);
                    }
                    var parsed = Date.parse(v);
                    return parsed ? new Date(parsed) : null;
                };
             break;
            
        }
        this.convert = cv;
    }
};

Wtf.data.Field.prototype = {
    dateFormat: null,
    defaultValue: "",
    mapping: null,
    sortType : null,
    sortDir : "ASC"
};

Wtf.data.DataReader = function(meta, recordType){
    
    this.meta = meta;
    this.recordType = recordType instanceof Array ? 
        Wtf.data.Record.create(recordType) : recordType;
};

Wtf.data.DataReader.prototype = {
    
};

Wtf.data.DataProxy = function(){
    this.addEvents(
        
        'beforeload',
        
        'load',
        
        'loadexception'
    );
    Wtf.data.DataProxy.superclass.constructor.call(this);
};

Wtf.extend(Wtf.data.DataProxy, Wtf.util.Observable);

Wtf.data.MemoryProxy = function(data){
    Wtf.data.MemoryProxy.superclass.constructor.call(this);
    this.data = data;
};

Wtf.extend(Wtf.data.MemoryProxy, Wtf.data.DataProxy, {
    
    load : function(params, reader, callback, scope, arg){
        params = params || {};
        var result;
        try {
            result = reader.readRecords(this.data);
        }catch(e){
            this.fireEvent("loadexception", this, arg, null, e);
            callback.call(scope, null, arg, false);
            return;
        }
        callback.call(scope, result, arg, true);
    },
    
    
    update : function(params, records){
        
    }
});

Wtf.data.HttpProxy = function(conn){
    Wtf.data.HttpProxy.superclass.constructor.call(this);
    
    this.conn = conn;
    this.useAjax = !conn || !conn.events;
};

Wtf.extend(Wtf.data.HttpProxy, Wtf.data.DataProxy, {
    
    getConnection : function(){
        return this.useAjax ? Wtf.Ajax : this.conn;
    },

    
    load : function(params, reader, callback, scope, arg){
        if(this.fireEvent("beforeload", this, params) !== false){
            var  o = {
                params : params || {},
                request: {
                    callback : callback,
                    scope : scope,
                    arg : arg
                },
                reader: reader,
                callback : this.loadResponse,
                scope: this
            };
            if(this.useAjax){
                Wtf.applyIf(o, this.conn);
                if(this.activeRequest){
                    Wtf.Ajax.abort(this.activeRequest);
                }
                this.activeRequest = Wtf.Ajax.request(o);
            }else{
                this.conn.request(o);
            }
        }else{
            callback.call(scope||this, null, arg, false);
        }
    },

    
    loadResponse : function(o, success, response){
        delete this.activeRequest;
        if(!success){
            this.fireEvent("loadexception", this, o, response);
            o.request.callback.call(o.request.scope, null, o.request.arg, false);
            return;
        }
        var result;
        try {
            result = o.reader.read(response);
        }catch(e){
            this.fireEvent("loadexception", this, o, response, e);
            o.request.callback.call(o.request.scope, null, o.request.arg, false);
            return;
        }
        this.fireEvent("load", this, o, o.request.arg);
        o.request.callback.call(o.request.scope, result, o.request.arg, true);
    },
    
    
    update : function(dataSet){
        
    },
    
    
    updateResponse : function(dataSet){
        
    }
});

Wtf.data.ScriptTagProxy = function(config){
    Wtf.data.ScriptTagProxy.superclass.constructor.call(this);
    Wtf.apply(this, config);
    this.head = document.getElementsByTagName("head")[0];
};

Wtf.data.ScriptTagProxy.TRANS_ID = 1000;

Wtf.extend(Wtf.data.ScriptTagProxy, Wtf.data.DataProxy, {
    
    
    timeout : 30000,
    
    callbackParam : "callback",
    
    nocache : true,

    
    load : function(params, reader, callback, scope, arg){
        if(this.fireEvent("beforeload", this, params) !== false){

            var p = Wtf.urlEncode(Wtf.apply(params, this.extraParams));

            var url = this.url;
            url += (url.indexOf("?") != -1 ? "&" : "?") + p;
            if(this.nocache){
                url += "&_dc=" + (new Date().getTime());
            }
            var transId = ++Wtf.data.ScriptTagProxy.TRANS_ID;
            var trans = {
                id : transId,
                cb : "stcCallback"+transId,
                scriptId : "stcScript"+transId,
                params : params,
                arg : arg,
                url : url,
                callback : callback,
                scope : scope,
                reader : reader
            };
            var conn = this;

            window[trans.cb] = function(o){
                conn.handleResponse(o, trans);
            };

            url += String.format("&{0}={1}", this.callbackParam, trans.cb);

            if(this.autoAbort !== false){
                this.abort();
            }

            trans.timeoutId = this.handleFailure.defer(this.timeout, this, [trans]);

            var script = document.createElement("script");
            script.setAttribute("src", url);
            script.setAttribute("type", "text/javascript");
            script.setAttribute("id", trans.scriptId);
            this.head.appendChild(script);

            this.trans = trans;
        }else{
            callback.call(scope||this, null, arg, false);
        }
    },

    
    isLoading : function(){
        return this.trans ? true : false;
    },

    
    abort : function(){
        if(this.isLoading()){
            this.destroyTrans(this.trans);
        }
    },

    
    destroyTrans : function(trans, isLoaded){
        this.head.removeChild(document.getElementById(trans.scriptId));
        clearTimeout(trans.timeoutId);
        if(isLoaded){
            window[trans.cb] = undefined;
            try{
                delete window[trans.cb];
            }catch(e){}
        }else{
            
            window[trans.cb] = function(){
                window[trans.cb] = undefined;
                try{
                    delete window[trans.cb];
                }catch(e){}
            };
        }
    },

    
    handleResponse : function(o, trans){
        this.trans = false;
        this.destroyTrans(trans, true);
        var result;
        try {
            result = trans.reader.readRecords(o);
        }catch(e){
            this.fireEvent("loadexception", this, o, trans.arg, e);
            trans.callback.call(trans.scope||window, null, trans.arg, false);
            return;
        }
        this.fireEvent("load", this, o, trans.arg);
        trans.callback.call(trans.scope||window, result, trans.arg, true);
    },

    
    handleFailure : function(trans){
        this.trans = false;
        this.destroyTrans(trans, false);
        this.fireEvent("loadexception", this, null, trans.arg);
        trans.callback.call(trans.scope||window, null, trans.arg, false);
    }
});

Wtf.data.JsonReader = function(meta, recordType){
    meta = meta || {};
    Wtf.data.JsonReader.superclass.constructor.call(this, meta, recordType || meta.fields);
};
Wtf.extend(Wtf.data.JsonReader, Wtf.data.DataReader, {
    
    
    read : function(response){
        var json = response.responseText;
        var o = eval("("+json+")");
        if(!o) {
            throw {message: "JsonReader.read: Json object not found"};
        }
        if(o.metaData){
            delete this.ef;
            this.meta = o.metaData;
            this.recordType = Wtf.data.Record.create(o.metaData.fields);
            this.onMetaChange(this.meta, this.recordType, o);
        }
        return this.readRecords(o);
    },

    
    onMetaChange : function(meta, recordType, o){

    },

    
    simpleAccess: function(obj, subsc) {
    	return obj[subsc];
    },

	
    getJsonAccessor: function(){
        var re = /[\[\.]/;
        return function(expr) {
            try {
                return(re.test(expr))
                    ? new Function("obj", "return obj." + expr)
                    : function(obj){
                        return obj[expr];
                    };
            } catch(e){}
            return Wtf.emptyFn;
        };
    }(),

    
    readRecords : function(o){
        
        this.jsonData = o;
        var s = this.meta, Record = this.recordType,
            f = Record.prototype.fields, fi = f.items, fl = f.length;


        if (!this.ef) {
            if(s.totalProperty) {
	            this.getTotal = this.getJsonAccessor(s.totalProperty);
	        }
	        if(s.successProperty) {
	            this.getSuccess = this.getJsonAccessor(s.successProperty);
	        }
	        this.getRoot = s.root ? this.getJsonAccessor(s.root) : function(p){return p;};
	        if (s.id) {
	        	var g = this.getJsonAccessor(s.id);
	        	this.getId = function(rec) {
	        		var r = g(rec);
		        	return (r === undefined || r === "") ? null : r;
	        	};
	        } else {
	        	this.getId = function(){return null;};
	        }
            this.ef = [];
            for(var i = 0; i < fl; i++){
                f = fi[i];
                var map = (f.mapping !== undefined && f.mapping !== null) ? f.mapping : f.name;
                this.ef[i] = this.getJsonAccessor(map);
            }
        }

    	var root = this.getRoot(o), c = root.length, totalRecords = c, success = true;
    	if(s.totalProperty){
            var v = parseInt(this.getTotal(o), 10);
            if(!isNaN(v)){
                totalRecords = v;
            }
        }
        if(s.successProperty){
            var v = this.getSuccess(o);
            if(v === false || v === 'false'){
                success = false;
            }
        }
        var records = [];
	    for(var i = 0; i < c; i++){
		    var n = root[i];
	        var values = {};
	        var id = this.getId(n);
	        for(var j = 0; j < fl; j++){
	            f = fi[j];
                var v = this.ef[j](n);
                values[f.name] = f.convert((v !== undefined) ? v : f.defaultValue);
	        }
	        var record = new Record(values, id);
	        record.json = n;
	        records[i] = record;
	    }
	    return {
	        success : success,
	        records : records,
	        totalRecords : totalRecords
	    };
    }
});

Wtf.data.XmlReader = function(meta, recordType){
    meta = meta || {};
    Wtf.data.XmlReader.superclass.constructor.call(this, meta, recordType || meta.fields);
};
Wtf.extend(Wtf.data.XmlReader, Wtf.data.DataReader, {
    
    read : function(response){
        var doc = response.responseXML;
        if(!doc) {
            throw {message: "XmlReader.read: XML Document not available"};
        }
        return this.readRecords(doc);
    },

    
    readRecords : function(doc){
        
        this.xmlData = doc;
        var root = doc.documentElement || doc;
    	var q = Wtf.DomQuery;
    	var recordType = this.recordType, fields = recordType.prototype.fields;
    	var sid = this.meta.id;
    	var totalRecords = 0, success = true;
    	if(this.meta.totalRecords){
    	    totalRecords = q.selectNumber(this.meta.totalRecords, root, 0);
    	}

        if(this.meta.success){
            var sv = q.selectValue(this.meta.success, root, true);
            success = sv !== false && sv !== 'false';
    	}
    	var records = [];
    	var ns = q.select(this.meta.record, root);
        for(var i = 0, len = ns.length; i < len; i++) {
	        var n = ns[i];
	        var values = {};
	        var id = sid ? q.selectValue(sid, n) : undefined;
	        for(var j = 0, jlen = fields.length; j < jlen; j++){
	            var f = fields.items[j];
                var v = q.selectValue(f.mapping || f.name, n, f.defaultValue);
	            v = f.convert(v);
	            values[f.name] = v;
	        }
	        var record = new recordType(values, id);
	        record.node = n;
	        records[records.length] = record;
	    }

	    return {
	        success : success,
	        records : records,
	        totalRecords : totalRecords || records.length
	    };
    }
});

Wtf.data.ArrayReader = Wtf.extend(Wtf.data.JsonReader, {
    
    readRecords : function(o){
        var sid = this.meta ? this.meta.id : null;
    	var recordType = this.recordType, fields = recordType.prototype.fields;
    	var records = [];
    	var root = o;
	    for(var i = 0; i < root.length; i++){
		    var n = root[i];
	        var values = {};
	        var id = ((sid || sid === 0) && n[sid] !== undefined && n[sid] !== "" ? n[sid] : null);
	        for(var j = 0, jlen = fields.length; j < jlen; j++){
                var f = fields.items[j];
                var k = f.mapping !== undefined && f.mapping !== null ? f.mapping : j;
                var v = n[k] !== undefined ? n[k] : f.defaultValue;
                v = f.convert(v);
                values[f.name] = v;
            }
	        var record = new recordType(values, id);
	        record.json = n;
	        records[records.length] = record;
	    }
	    return {
	        records : records,
	        totalRecords : records.length
	    };
    }
});

Wtf.data.Tree = function(root){
   this.nodeHash = {};
   
   this.root = null;
   if(root){
       this.setRootNode(root);
   }
   this.addEvents(
       
       "append",
       
       "remove",
       
       "move",
       
       "insert",
       
       "beforeappend",
       
       "beforeremove",
       
       "beforemove",
       
       "beforeinsert"
   );

    Wtf.data.Tree.superclass.constructor.call(this);
};

Wtf.extend(Wtf.data.Tree, Wtf.util.Observable, {
    
    pathSeparator: "/",

    
    proxyNodeEvent : function(){
        return this.fireEvent.apply(this, arguments);
    },

    
    getRootNode : function(){
        return this.root;
    },

    
    setRootNode : function(node){
        this.root = node;
        node.ownerTree = this;
        node.isRoot = true;
        this.registerNode(node);
        return node;
    },

    
    getNodeById : function(id){
        return this.nodeHash[id];
    },

    
    registerNode : function(node){
        this.nodeHash[node.id] = node;
    },

    
    unregisterNode : function(node){
        delete this.nodeHash[node.id];
    },

    toString : function(){
        return "[Tree"+(this.id?" "+this.id:"")+"]";
    }
});


Wtf.data.Node = function(attributes){
    
    this.attributes = attributes || {};
    this.leaf = this.attributes.leaf;
    
    this.id = this.attributes.id;
    if(!this.id){
        this.id = Wtf.id(null, "ynode-");
        this.attributes.id = this.id;
    }
    
    this.childNodes = [];
    if(!this.childNodes.indexOf){ 
        this.childNodes.indexOf = function(o){
            for(var i = 0, len = this.length; i < len; i++){
                if(this[i] == o) return i;
            }
            return -1;
        };
    }
    
    this.parentNode = null;
    
    this.firstChild = null;
    
    this.lastChild = null;
    
    this.previousSibling = null;
    
    this.nextSibling = null;

    this.addEvents({
       
       "append" : true,
       
       "remove" : true,
       
       "move" : true,
       
       "insert" : true,
       
       "beforeappend" : true,
       
       "beforeremove" : true,
       
       "beforemove" : true,
       
       "beforeinsert" : true
   });
    this.listeners = this.attributes.listeners;
    Wtf.data.Node.superclass.constructor.call(this);
};

Wtf.extend(Wtf.data.Node, Wtf.util.Observable, {
    
    fireEvent : function(evtName){
        
        if(Wtf.data.Node.superclass.fireEvent.apply(this, arguments) === false){
            return false;
        }
        
        var ot = this.getOwnerTree();
        if(ot){
            if(ot.proxyNodeEvent.apply(ot, arguments) === false){
                return false;
            }
        }
        return true;
    },

    
    isLeaf : function(){
        return this.leaf === true;
    },

    
    setFirstChild : function(node){
        this.firstChild = node;
    },

    
    setLastChild : function(node){
        this.lastChild = node;
    },


    
    isLast : function(){
       return (!this.parentNode ? true : this.parentNode.lastChild == this);
    },

    
    isFirst : function(){
       return (!this.parentNode ? true : this.parentNode.firstChild == this);
    },

    hasChildNodes : function(){
        return !this.isLeaf() && this.childNodes.length > 0;
    },

    
    appendChild : function(node){
        var multi = false;
        if(node instanceof Array){
            multi = node;
        }else if(arguments.length > 1){
            multi = arguments;
        }
        
        if(multi){
            for(var i = 0, len = multi.length; i < len; i++) {
            	this.appendChild(multi[i]);
            }
        }else{
            if(this.fireEvent("beforeappend", this.ownerTree, this, node) === false){
                return false;
            }
            var index = this.childNodes.length;
            var oldParent = node.parentNode;
            
            if(oldParent){
                if(node.fireEvent("beforemove", node.getOwnerTree(), node, oldParent, this, index) === false){
                    return false;
                }
                oldParent.removeChild(node);
            }
            index = this.childNodes.length;
            if(index == 0){
                this.setFirstChild(node);
            }
            this.childNodes.push(node);
            node.parentNode = this;
            var ps = this.childNodes[index-1];
            if(ps){
                node.previousSibling = ps;
                ps.nextSibling = node;
            }else{
                node.previousSibling = null;
            }
            node.nextSibling = null;
            this.setLastChild(node);
            node.setOwnerTree(this.getOwnerTree());
            this.fireEvent("append", this.ownerTree, this, node, index);
            if(oldParent){
                node.fireEvent("move", this.ownerTree, node, oldParent, this, index);
            }
            return node;
        }
    },

    
    removeChild : function(node){
        var index = this.childNodes.indexOf(node);
        if(index == -1){
            return false;
        }
        if(this.fireEvent("beforeremove", this.ownerTree, this, node) === false){
            return false;
        }

        
        this.childNodes.splice(index, 1);

        
        if(node.previousSibling){
            node.previousSibling.nextSibling = node.nextSibling;
        }
        if(node.nextSibling){
            node.nextSibling.previousSibling = node.previousSibling;
        }

        
        if(this.firstChild == node){
            this.setFirstChild(node.nextSibling);
        }
        if(this.lastChild == node){
            this.setLastChild(node.previousSibling);
        }

        node.setOwnerTree(null);
        
        node.parentNode = null;
        node.previousSibling = null;
        node.nextSibling = null;
        this.fireEvent("remove", this.ownerTree, this, node);
        return node;
    },

    
    insertBefore : function(node, refNode){
        if(!refNode){ 
            return this.appendChild(node);
        }
        
        if(node == refNode){
            return false;
        }

        if(this.fireEvent("beforeinsert", this.ownerTree, this, node, refNode) === false){
            return false;
        }
        var index = this.childNodes.indexOf(refNode);
        var oldParent = node.parentNode;
        var refIndex = index;

        
        if(oldParent == this && this.childNodes.indexOf(node) < index){
            refIndex--;
        }

        
        if(oldParent){
            if(node.fireEvent("beforemove", node.getOwnerTree(), node, oldParent, this, index, refNode) === false){
                return false;
            }
            oldParent.removeChild(node);
        }
        if(refIndex == 0){
            this.setFirstChild(node);
        }
        this.childNodes.splice(refIndex, 0, node);
        node.parentNode = this;
        var ps = this.childNodes[refIndex-1];
        if(ps){
            node.previousSibling = ps;
            ps.nextSibling = node;
        }else{
            node.previousSibling = null;
        }
        node.nextSibling = refNode;
        refNode.previousSibling = node;
        node.setOwnerTree(this.getOwnerTree());
        this.fireEvent("insert", this.ownerTree, this, node, refNode);
        if(oldParent){
            node.fireEvent("move", this.ownerTree, node, oldParent, this, refIndex, refNode);
        }
        return node;
    },

    
    remove : function(){
        this.parentNode.removeChild(this);
        return this;
    },

    
    item : function(index){
        return this.childNodes[index];
    },

    
    replaceChild : function(newChild, oldChild){
        this.insertBefore(newChild, oldChild);
        this.removeChild(oldChild);
        return oldChild;
    },

    
    indexOf : function(child){
        return this.childNodes.indexOf(child);
    },

    
    getOwnerTree : function(){
        
        if(!this.ownerTree){
            var p = this;
            while(p){
                if(p.ownerTree){
                    this.ownerTree = p.ownerTree;
                    break;
                }
                p = p.parentNode;
            }
        }
        return this.ownerTree;
    },

    
    getDepth : function(){
        var depth = 0;
        var p = this;
        while(p.parentNode){
            ++depth;
            p = p.parentNode;
        }
        return depth;
    },

    
    setOwnerTree : function(tree){
        
        if(tree != this.ownerTree){
            if(this.ownerTree){
                this.ownerTree.unregisterNode(this);
            }
            this.ownerTree = tree;
            var cs = this.childNodes;
            for(var i = 0, len = cs.length; i < len; i++) {
            	cs[i].setOwnerTree(tree);
            }
            if(tree){
                tree.registerNode(this);
            }
        }
    },

    
    getPath : function(attr){
        attr = attr || "id";
        var p = this.parentNode;
        var b = [this.attributes[attr]];
        while(p){
            b.unshift(p.attributes[attr]);
            p = p.parentNode;
        }
        var sep = this.getOwnerTree().pathSeparator;
        return sep + b.join(sep);
    },

    
    bubble : function(fn, scope, args){
        var p = this;
        while(p){
            if(fn.apply(scope || p, args || [p]) === false){
                break;
            }
            p = p.parentNode;
        }
    },

    
    cascade : function(fn, scope, args){
        if(fn.apply(scope || this, args || [this]) !== false){
            var cs = this.childNodes;
            for(var i = 0, len = cs.length; i < len; i++) {
            	cs[i].cascade(fn, scope, args);
            }
        }
    },

    
    eachChild : function(fn, scope, args){
        var cs = this.childNodes;
        for(var i = 0, len = cs.length; i < len; i++) {
        	if(fn.apply(scope || this, args || [cs[i]]) === false){
        	    break;
        	}
        }
    },

    
    findChild : function(attribute, value){
        var cs = this.childNodes;
        for(var i = 0, len = cs.length; i < len; i++) {
        	if(cs[i].attributes[attribute] == value){
        	    return cs[i];
        	}
        }
        return null;
    },

    
    findChildBy : function(fn, scope){
        var cs = this.childNodes;
        for(var i = 0, len = cs.length; i < len; i++) {
        	if(fn.call(scope||cs[i], cs[i]) === true){
        	    return cs[i];
        	}
        }
        return null;
    },

    
    sort : function(fn, scope){
        var cs = this.childNodes;
        var len = cs.length;
        if(len > 0){
            var sortFn = scope ? function(){fn.apply(scope, arguments);} : fn;
            cs.sort(sortFn);
            for(var i = 0; i < len; i++){
                var n = cs[i];
                n.previousSibling = cs[i-1];
                n.nextSibling = cs[i+1];
                if(i == 0){
                    this.setFirstChild(n);
                }
                if(i == len-1){
                    this.setLastChild(n);
                }
            }
        }
    },

    
    contains : function(node){
        return node.isAncestor(this);
    },

    
    isAncestor : function(node){
        var p = this.parentNode;
        while(p){
            if(p == node){
                return true;
            }
            p = p.parentNode;
        }
        return false;
    },

    toString : function(){
        return "[Node"+(this.id?" "+this.id:"")+"]";
    }
});

Wtf.data.GroupingStore = Wtf.extend(Wtf.data.Store, {
    
    
    remoteGroup : false,
    
    groupOnSort:false,

    
    clearGrouping : function(){
        this.groupField = false;
        if(this.remoteGroup){
            if(this.baseParams){
                delete this.baseParams.groupBy;
            }
            this.reload();
        }else{
            this.applySort();
            this.fireEvent('datachanged', this);
        }
    },

    
    groupBy : function(field, forceRegroup){
        if(this.groupField == field && !forceRegroup){
            return; 
        }
        this.groupField = field;
        if(this.remoteGroup){
            if(!this.baseParams){
                this.baseParams = {};
            }
            this.baseParams['groupBy'] = field;
        }
        if(this.groupOnSort){
            this.sort(field);
            return;
        }
        if(this.remoteGroup){
            this.reload();
        }else{
            var si = this.sortInfo || {};
            if(si.field != field){
                this.applySort();
            }else{
                this.sortData(field);
            }
            this.fireEvent('datachanged', this);
        }
    },

    
    applySort : function(){
        Wtf.data.GroupingStore.superclass.applySort.call(this);
        if(!this.groupOnSort && !this.remoteGroup){
            var gs = this.getGroupState();
            if(gs && gs != this.sortInfo.field){
                this.sortData(this.groupField);
            }
        }
    },

    
    applyGrouping : function(alwaysFireChange){
        if(this.groupField !== false){
            this.groupBy(this.groupField, true);
            return true;
        }else{
            if(alwaysFireChange === true){
                this.fireEvent('datachanged', this);
            }
            return false;
        }
    },

    
    getGroupState : function(){
        return this.groupOnSort && this.groupField !== false ?
               (this.sortInfo ? this.sortInfo.field : undefined) : this.groupField;
    }
});

Wtf.ComponentMgr = function(){
    var all = new Wtf.util.MixedCollection();
    var types = {};

    return {
        
        register : function(c){
            all.add(c);
        },

        
        unregister : function(c){
            all.remove(c);
        },

        
        get : function(id){
            return all.get(id);
        },

        
        onAvailable : function(id, fn, scope){
            all.on("add", function(index, o){
                if(o.id == id){
                    fn.call(scope || o, o);
                    all.un("add", fn, scope);
                }
            });
        },

        
        all : all,

        
        registerType : function(xtype, cls){
            types[xtype] = cls;
            cls.xtype = xtype;
        },

        
        create : function(config, defaultType){
            return new types[config.xtype || defaultType](config);
        }
    };
}();



Wtf.reg = Wtf.ComponentMgr.registerType;

Wtf.Component = function(config){
    config = config || {};
    if(config.initialConfig){
        if(config.isAction){                       this.baseAction = config;
        }
        config = config.initialConfig;     }else if(config.tagName || config.dom || typeof config == "string"){         config = {applyTo: config, id: config.id || config};
    }

    
    this.initialConfig = config;

    Wtf.apply(this, config);
    this.addEvents(
        
        'disable',
        
        'enable',
        
        'beforeshow',
        
        'show',
        
        'beforehide',
        
        'hide',
        
        'beforerender',
        
        'render',
        
        'beforedestroy',
        
        'destroy',
        
        'beforestaterestore',
        
        'staterestore',
        
        'beforestatesave',
        
        'statesave'
    );
    this.getId();
    Wtf.ComponentMgr.register(this);
    Wtf.Component.superclass.constructor.call(this);

    if(this.baseAction){
        this.baseAction.addComponent(this);
    }

    this.initComponent();

    if(this.plugins){
        if(this.plugins instanceof Array){
            for(var i = 0, len = this.plugins.length; i < len; i++){
                this.plugins[i].init(this);
            }
        }else{
            this.plugins.init(this);
        }
    }

    if(this.stateful !== false){
        this.initState(config);
    }

    if(this.applyTo){
        this.applyToMarkup(this.applyTo);
        delete this.applyTo;
    }else if(this.renderTo){
        this.render(this.renderTo);
        delete this.renderTo;
    }
};

Wtf.Component.AUTO_ID = 1000;

Wtf.extend(Wtf.Component, Wtf.util.Observable, {
    
    
    
    
    
    
    
    

    
    

    
    disabledClass : "x-item-disabled",
	
    allowDomMove : true,
	
    autoShow : false,
    
    hideMode: 'display',
    
    hideParent: false,

    
    
    hidden : false,
    
    disabled : false,
    
    rendered : false,

        ctype : "Wtf.Component",

        actionMode : "el",

        getActionEl : function(){
        return this[this.actionMode];
    },

    
    initComponent : Wtf.emptyFn,

    
    render : function(container, position){
        if(!this.rendered && this.fireEvent("beforerender", this) !== false){
            if(!container && this.el){
                this.el = Wtf.get(this.el);
                container = this.el.dom.parentNode;
                this.allowDomMove = false;
            }
            this.container = Wtf.get(container);
            if(this.ctCls){
                this.container.addClass(this.ctCls);
            }
            this.rendered = true;
            if(position !== undefined){
                if(typeof position == 'number'){
                    position = this.container.dom.childNodes[position];
                }else{
                    position = Wtf.getDom(position);
                }
            }
            this.onRender(this.container, position || null);
            if(this.autoShow){
                this.el.removeClass(['x-hidden','x-hide-' + this.hideMode]);
            }
            if(this.cls){
                this.el.addClass(this.cls);
                delete this.cls;
            }
            if(this.style){
                this.el.applyStyles(this.style);
                delete this.style;
            }
            this.fireEvent("render", this);
            this.afterRender(this.container);
            if(this.hidden){
                this.hide();
            }
            if(this.disabled){
                this.disable();
            }

            this.initStateEvents();
        }
        return this;
    },

        initState : function(config){
        if(Wtf.state.Manager){
            var state = Wtf.state.Manager.get(this.stateId || this.id);
            if(state){
                if(this.fireEvent('beforestaterestore', this, state) !== false){
                    this.applyState(state);
                    this.fireEvent('staterestore', this, state);
                }
            }
        }
    },

        initStateEvents : function(){
        if(this.stateEvents){
            for(var i = 0, e; e = this.stateEvents[i]; i++){
                this.on(e, this.saveState, this, {delay:100});
            }
        }
    },

        applyState : function(state, config){
        if(state){
            Wtf.apply(this, state);
        }
    },

        getState : function(){
        return null;
    },

        saveState : function(){
        if(Wtf.state.Manager){
            var state = this.getState();
            if(this.fireEvent('beforestatesave', this, state) !== false){
                Wtf.state.Manager.set(this.stateId || this.id, state);
                this.fireEvent('statesave', this, state);
            }
        }
    },

    
    applyToMarkup : function(el){
        this.allowDomMove = false;
        this.el = Wtf.get(el);
        this.render(this.el.dom.parentNode);
    },

    
    addClass : function(cls){
        if(this.el){
            this.el.addClass(cls);
        }else{
            this.cls = this.cls ? this.cls + ' ' + cls : cls;
        }
    },

    
    removeClass : function(cls){
        if(this.el){
            this.el.removeClass(cls);
        }else if(this.cls){
            this.cls = this.cls.split(' ').remove(cls).join(' ');
        }
    },

            onRender : function(ct, position){
        if(this.autoEl){
            if(typeof this.autoEl == 'string'){
                this.el = document.createElement(this.autoEl);
            }else{
                var div = document.createElement('div');
                Wtf.DomHelper.overwrite(div, this.autoEl);
                this.el = div.firstChild;
            }
        }
        if(this.el){
            this.el = Wtf.get(this.el);
            if(this.allowDomMove !== false){
                ct.dom.insertBefore(this.el.dom, position);
            }
        }
    },

        getAutoCreate : function(){
        var cfg = typeof this.autoCreate == "object" ?
                      this.autoCreate : Wtf.apply({}, this.defaultAutoCreate);
        if(this.id && !cfg.id){
            cfg.id = this.id;
        }
        return cfg;
    },

        afterRender : Wtf.emptyFn,

    
    destroy : function(){
        if(this.fireEvent("beforedestroy", this) !== false){
            this.beforeDestroy();
            if(this.rendered){
                this.el.removeAllListeners();
                this.el.remove();
                if(this.actionMode == "container"){
                    this.container.remove();
                }
            }
            this.onDestroy();
            Wtf.ComponentMgr.unregister(this);
            this.fireEvent("destroy", this);
            this.purgeListeners();
        }
    },

	    beforeDestroy : Wtf.emptyFn,

	    onDestroy  : Wtf.emptyFn,

    
    getEl : function(){
        return this.el;
    },

    
    getId : function(){
        return this.id || (this.id = "wtf-comp-" + (++Wtf.Component.AUTO_ID));
    },

    
    getItemId : function(){
        return this.itemId || this.getId();
    },

    
    focus : function(selectText, delay){
        if(delay){
            this.focus.defer(typeof delay == 'number' ? delay : 10, this, [selectText, false]);
            return;
        }
        if(this.rendered){
            this.el.focus();
            if(selectText === true){
                this.el.dom.select();
            }
        }
        return this;
    },

        blur : function(){
        if(this.rendered){
            this.el.blur();
        }
        return this;
    },

    
    disable : function(){
        if(this.rendered){
            this.onDisable();
        }
        this.disabled = true;
        this.fireEvent("disable", this);
        return this;
    },

	    onDisable : function(){
        this.getActionEl().addClass(this.disabledClass);
        this.el.dom.disabled = true;
    },

    
    enable : function(){
        if(this.rendered){
            this.onEnable();
        }
        this.disabled = false;
        this.fireEvent("enable", this);
        return this;
    },

	    onEnable : function(){
        this.getActionEl().removeClass(this.disabledClass);
        this.el.dom.disabled = false;
    },

    
    setDisabled : function(disabled){
        this[disabled ? "disable" : "enable"]();
    },

    
    show: function(){
        if(this.fireEvent("beforeshow", this) !== false){
            this.hidden = false;
            if(this.autoRender){
                this.render(typeof this.autoRender == 'boolean' ? Wtf.getBody() : this.autoRender);
            }
            if(this.rendered){
                this.onShow();
            }
            this.fireEvent("show", this);
        }
        return this;
    },

        onShow : function(){
        if(this.hideParent){
            this.container.removeClass('x-hide-' + this.hideMode);
        }else{
            this.getActionEl().removeClass('x-hide-' + this.hideMode);
        }

    },

    
    hide: function(){
        if(this.fireEvent("beforehide", this) !== false){
            this.hidden = true;
            if(this.rendered){
                this.onHide();
            }
            this.fireEvent("hide", this);
        }
        return this;
    },

        onHide : function(){
        if(this.hideParent){
            this.container.addClass('x-hide-' + this.hideMode);
        }else{
            this.getActionEl().addClass('x-hide-' + this.hideMode);
        }
    },

    
    setVisible: function(visible){
        if(visible) {
            this.show();
        }else{
            this.hide();
        }
        return this;
    },

    
    isVisible : function(){
        return this.rendered && this.getActionEl().isVisible();
    },

    
    cloneConfig : function(overrides){
        overrides = overrides || {};
        var id = overrides.id || Wtf.id();
        var cfg = Wtf.applyIf(overrides, this.initialConfig);
        cfg.id = id;         return new this.constructor(cfg);
    },

    
    getXType : function(){
        return this.constructor.xtype;
    },

    
    isXType : function(xtype, shallow){
        return !shallow ?
               ('/' + this.getXTypes() + '/').indexOf('/' + xtype + '/') != -1 :
                this.constructor.xtype == xtype;
    },

    
    getXTypes : function(){
        var tc = this.constructor;
        if(!tc.xtypes){
            var c = [], sc = this;
            while(sc && sc.constructor.xtype){
                c.unshift(sc.constructor.xtype);
                sc = sc.constructor.superclass;
            }
            tc.xtypeChain = c;
            tc.xtypes = c.join('/');
        }
        return tc.xtypes;
    }
});

Wtf.reg('component', Wtf.Component);


Wtf.Action = function(config){
    this.initialConfig = config;
    this.items = [];
}

Wtf.Action.prototype = {
    
    
    
    
    
    

    
    isAction : true,

    
    setText : function(text){
        this.initialConfig.text = text;
        this.callEach('setText', [text]);
    },

    
    getText : function(){
        return this.initialConfig.text;
    },

    
    setIconClass : function(cls){
        this.initialConfig.iconCls = cls;
        this.callEach('setIconClass', [cls]);
    },

    
    getIconClass : function(){
        return this.initialConfig.iconCls;
    },

    
    setDisabled : function(v){
        this.initialConfig.disabled = v;
        this.callEach('setDisabled', [v]);
    },

    
    enable : function(){
        this.setDisabled(false);
    },

    
    disable : function(){
        this.setDisabled(true);
    },

    
    isDisabled : function(){
        return this.initialConfig.disabled;
    },

    
    setHidden : function(v){
        this.initialConfig.hidden = v;
        this.callEach('setVisible', [!v]);
    },

    
    show : function(){
        this.setHidden(false);
    },

    
    hide : function(){
        this.setHidden(true);
    },

    
    isHidden : function(){
        return this.initialConfig.hidden;
    },

    
    setHandler : function(fn, scope){
        this.initialConfig.handler = fn;
        this.initialConfig.scope = scope;
        this.callEach('setHandler', [fn, scope]);
    },

    
    each : function(fn, scope){
        Wtf.each(this.items, fn, scope);
    },

    
    callEach : function(fnName, args){
        var cs = this.items;
        for(var i = 0, len = cs.length; i < len; i++){
            cs[i][fnName].apply(cs[i], args);
        }
    },

    
    addComponent : function(comp){
        this.items.push(comp);
        comp.on('destroy', this.removeComponent, this);
    },

    
    removeComponent : function(comp){
        this.items.remove(comp);
    }
};

(function(){ 
Wtf.Layer = function(config, existingEl){
    config = config || {};
    var dh = Wtf.DomHelper;
    var cp = config.parentEl, pel = cp ? Wtf.getDom(cp) : document.body;
    if(existingEl){
        this.dom = Wtf.getDom(existingEl);
    }
    if(!this.dom){
        var o = config.dh || {tag: "div", cls: "x-layer"};
        this.dom = dh.append(pel, o);
    }
    if(config.cls){
        this.addClass(config.cls);
    }
    this.constrain = config.constrain !== false;
    this.visibilityMode = Wtf.Element.VISIBILITY;
    if(config.id){
        this.id = this.dom.id = config.id;
    }else{
        this.id = Wtf.id(this.dom);
    }
    this.zindex = config.zindex || this.getZIndex();
    this.position("absolute", this.zindex);
    if(config.shadow){
        this.shadowOffset = config.shadowOffset || 4;
        this.shadow = new Wtf.Shadow({
            offset : this.shadowOffset,
            mode : config.shadow
        });
    }else{
        this.shadowOffset = 0;
    }
    this.useShim = config.shim !== false && Wtf.useShims;
    this.useDisplay = config.useDisplay;
    this.hide();
};

var supr = Wtf.Element.prototype;


var shims = [];

Wtf.extend(Wtf.Layer, Wtf.Element, {

    getZIndex : function(){
        return this.zindex || parseInt(this.getStyle("z-index"), 10) || 11000;
    },

    getShim : function(){
        if(!this.useShim){
            return null;
        }
        if(this.shim){
            return this.shim;
        }
        var shim = shims.shift();
        if(!shim){
            shim = this.createShim();
            shim.enableDisplayMode('block');
            shim.dom.style.display = 'none';
            shim.dom.style.visibility = 'visible';
        }
        var pn = this.dom.parentNode;
        if(shim.dom.parentNode != pn){
            pn.insertBefore(shim.dom, this.dom);
        }
        shim.setStyle('z-index', this.getZIndex()-2);
        this.shim = shim;
        return shim;
    },

    hideShim : function(){
        if(this.shim){
            this.shim.setDisplayed(false);
            shims.push(this.shim);
            delete this.shim;
        }
    },

    disableShadow : function(){
        if(this.shadow){
            this.shadowDisabled = true;
            this.shadow.hide();
            this.lastShadowOffset = this.shadowOffset;
            this.shadowOffset = 0;
        }
    },

    enableShadow : function(show){
        if(this.shadow){
            this.shadowDisabled = false;
            this.shadowOffset = this.lastShadowOffset;
            delete this.lastShadowOffset;
            if(show){
                this.sync(true);
            }
        }
    },

    
    
    
    sync : function(doShow){
        var sw = this.shadow;
        if(!this.updating && this.isVisible() && (sw || this.useShim)){
            var sh = this.getShim();

            var w = this.getWidth(),
                h = this.getHeight();

            var l = this.getLeft(true),
                t = this.getTop(true);

            if(sw && !this.shadowDisabled){
                if(doShow && !sw.isVisible()){
                    sw.show(this);
                }else{
                    sw.realign(l, t, w, h);
                }
                if(sh){
                    if(doShow){
                       sh.show();
                    }
                    
                    var a = sw.adjusts, s = sh.dom.style;
                    s.left = (Math.min(l, l+a.l))+"px";
                    s.top = (Math.min(t, t+a.t))+"px";
                    s.width = (w+a.w)+"px";
                    s.height = (h+a.h)+"px";
                }
            }else if(sh){
                if(doShow){
                   sh.show();
                }
                sh.setSize(w, h);
                sh.setLeftTop(l, t);
            }
            
        }
    },

    
    destroy : function(){
        this.hideShim();
        if(this.shadow){
            this.shadow.hide();
        }
        this.removeAllListeners();
        Wtf.removeNode(this.dom);
        Wtf.Element.uncache(this.id);
    },

    remove : function(){
        this.destroy();
    },

    
    beginUpdate : function(){
        this.updating = true;
    },

    
    endUpdate : function(){
        this.updating = false;
        this.sync(true);
    },

    
    hideUnders : function(negOffset){
        if(this.shadow){
            this.shadow.hide();
        }
        this.hideShim();
    },

    
    constrainXY : function(){
        if(this.constrain){
            var vw = Wtf.lib.Dom.getViewWidth(),
                vh = Wtf.lib.Dom.getViewHeight();
            var s = Wtf.getDoc().getScroll();

            var xy = this.getXY();
            var x = xy[0], y = xy[1];   
            var w = this.dom.offsetWidth+this.shadowOffset, h = this.dom.offsetHeight+this.shadowOffset;
            
            var moved = false;
            
            if((x + w) > vw+s.left){
                x = vw - w - this.shadowOffset;
                moved = true;
            }
            if((y + h) > vh+s.top){
                y = vh - h - this.shadowOffset;
                moved = true;
            }
            
            if(x < s.left){
                x = s.left;
                moved = true;
            }
            if(y < s.top){
                y = s.top;
                moved = true;
            }
            if(moved){
                if(this.avoidY){
                    var ay = this.avoidY;
                    if(y <= ay && (y+h) >= ay){
                        y = ay-h-5;   
                    }
                }
                xy = [x, y];
                this.storeXY(xy);
                supr.setXY.call(this, xy);
                this.sync();
            }
        }
    },

    isVisible : function(){
        return this.visible;    
    },

    
    showAction : function(){
        this.visible = true; 
        if(this.useDisplay === true){
            this.setDisplayed("");
        }else if(this.lastXY){
            supr.setXY.call(this, this.lastXY);
        }else if(this.lastLT){
            supr.setLeftTop.call(this, this.lastLT[0], this.lastLT[1]);
        }
    },

    
    hideAction : function(){
        this.visible = false;
        if(this.useDisplay === true){
            this.setDisplayed(false);
        }else{
            this.setLeftTop(-10000,-10000);
        }
    },

    
    setVisible : function(v, a, d, c, e){
        if(v){
            this.showAction();
        }
        if(a && v){
            var cb = function(){
                this.sync(true);
                if(c){
                    c();
                }
            }.createDelegate(this);
            supr.setVisible.call(this, true, true, d, cb, e);
        }else{
            if(!v){
                this.hideUnders(true);
            }
            var cb = c;
            if(a){
                cb = function(){
                    this.hideAction();
                    if(c){
                        c();
                    }
                }.createDelegate(this);
            }
            supr.setVisible.call(this, v, a, d, cb, e);
            if(v){
                this.sync(true);
            }else if(!a){
                this.hideAction();
            }
        }
    },

    storeXY : function(xy){
        delete this.lastLT;
        this.lastXY = xy;
    },

    storeLeftTop : function(left, top){
        delete this.lastXY;
        this.lastLT = [left, top];
    },

    
    beforeFx : function(){
        this.beforeAction();
        return Wtf.Layer.superclass.beforeFx.apply(this, arguments);
    },

    
    afterFx : function(){
        Wtf.Layer.superclass.afterFx.apply(this, arguments);
        this.sync(this.isVisible());
    },

    
    beforeAction : function(){
        if(!this.updating && this.shadow){
            this.shadow.hide();
        }
    },

    
    setLeft : function(left){
        this.storeLeftTop(left, this.getTop(true));
        supr.setLeft.apply(this, arguments);
        this.sync();
    },

    setTop : function(top){
        this.storeLeftTop(this.getLeft(true), top);
        supr.setTop.apply(this, arguments);
        this.sync();
    },

    setLeftTop : function(left, top){
        this.storeLeftTop(left, top);
        supr.setLeftTop.apply(this, arguments);
        this.sync();
    },

    setXY : function(xy, a, d, c, e){
        this.fixDisplay();
        this.beforeAction();
        this.storeXY(xy);
        var cb = this.createCB(c);
        supr.setXY.call(this, xy, a, d, cb, e);
        if(!a){
            cb();
        }
    },

    
    createCB : function(c){
        var el = this;
        return function(){
            el.constrainXY();
            el.sync(true);
            if(c){
                c();
            }
        };
    },

    
    setX : function(x, a, d, c, e){
        this.setXY([x, this.getY()], a, d, c, e);
    },

    
    setY : function(y, a, d, c, e){
        this.setXY([this.getX(), y], a, d, c, e);
    },

    
    setSize : function(w, h, a, d, c, e){
        this.beforeAction();
        var cb = this.createCB(c);
        supr.setSize.call(this, w, h, a, d, cb, e);
        if(!a){
            cb();
        }
    },

    
    setWidth : function(w, a, d, c, e){
        this.beforeAction();
        var cb = this.createCB(c);
        supr.setWidth.call(this, w, a, d, cb, e);
        if(!a){
            cb();
        }
    },

    
    setHeight : function(h, a, d, c, e){
        this.beforeAction();
        var cb = this.createCB(c);
        supr.setHeight.call(this, h, a, d, cb, e);
        if(!a){
            cb();
        }
    },

    
    setBounds : function(x, y, w, h, a, d, c, e){
        this.beforeAction();
        var cb = this.createCB(c);
        if(!a){
            this.storeXY([x, y]);
            supr.setXY.call(this, [x, y]);
            supr.setSize.call(this, w, h, a, d, cb, e);
            cb();
        }else{
            supr.setBounds.call(this, x, y, w, h, a, d, cb, e);
        }
        return this;
    },
    
    
    setZIndex : function(zindex){
        this.zindex = zindex;
        this.setStyle("z-index", zindex + 2);
        if(this.shadow){
            this.shadow.setZIndex(zindex + 1);
        }
        if(this.shim){
            this.shim.setStyle("z-index", zindex);
        }
    }
});
})();

Wtf.Shadow = function(config){
    Wtf.apply(this, config);
    if(typeof this.mode != "string"){
        this.mode = this.defaultMode;
    }
    var o = this.offset, a = {h: 0};
    var rad = Math.floor(this.offset/2);
    switch(this.mode.toLowerCase()){         case "drop":
            a.w = 0;
            a.l = a.t = o;
            a.t -= 1;
            if(Wtf.isIE){
                a.l -= this.offset + rad;
                a.t -= this.offset + rad;
                a.w -= rad;
                a.h -= rad;
                a.t += 1;
            }
        break;
        case "sides":
            a.w = (o*2);
            a.l = -o;
            a.t = o-1;
            if(Wtf.isIE){
                a.l -= (this.offset - rad);
                a.t -= this.offset + rad;
                a.l += 1;
                a.w -= (this.offset - rad)*2;
                a.w -= rad + 1;
                a.h -= 1;
            }
        break;
        case "frame":
            a.w = a.h = (o*2);
            a.l = a.t = -o;
            a.t += 1;
            a.h -= 2;
            if(Wtf.isIE){
                a.l -= (this.offset - rad);
                a.t -= (this.offset - rad);
                a.l += 1;
                a.w -= (this.offset + rad + 1);
                a.h -= (this.offset + rad);
                a.h += 1;
            }
        break;
    };

    this.adjusts = a;
};

Wtf.Shadow.prototype = {
    
    
    offset: 4,

        defaultMode: "drop",

    
    show : function(target){
        target = Wtf.get(target);
        if(!this.el){
            this.el = Wtf.Shadow.Pool.pull();
            if(this.el.dom.nextSibling != target.dom){
                this.el.insertBefore(target);
            }
        }
        this.el.setStyle("z-index", this.zIndex || parseInt(target.getStyle("z-index"), 10)-1);
        if(Wtf.isIE){
            this.el.dom.style.filter="progid:DXImageTransform.Microsoft.alpha(opacity=50) progid:DXImageTransform.Microsoft.Blur(pixelradius="+(this.offset)+")";
        }
        this.realign(
            target.getLeft(true),
            target.getTop(true),
            target.getWidth(),
            target.getHeight()
        );
        this.el.dom.style.display = "block";
    },

    
    isVisible : function(){
        return this.el ? true : false;  
    },

    
    realign : function(l, t, w, h){
        if(!this.el){
            return;
        }
        var a = this.adjusts, d = this.el.dom, s = d.style;
        var iea = 0;
        s.left = (l+a.l)+"px";
        s.top = (t+a.t)+"px";
        var sw = (w+a.w), sh = (h+a.h), sws = sw +"px", shs = sh + "px";
        if(s.width != sws || s.height != shs){
            s.width = sws;
            s.height = shs;
            if(!Wtf.isIE){
                var cn = d.childNodes;
                var sww = Math.max(0, (sw-12))+"px";
                cn[0].childNodes[1].style.width = sww;
                cn[1].childNodes[1].style.width = sww;
                cn[2].childNodes[1].style.width = sww;
                cn[1].style.height = Math.max(0, (sh-12))+"px";
            }
        }
    },

    
    hide : function(){
        if(this.el){
            this.el.dom.style.display = "none";
            Wtf.Shadow.Pool.push(this.el);
            delete this.el;
        }
    },

    
    setZIndex : function(z){
        this.zIndex = z;
        if(this.el){
            this.el.setStyle("z-index", z);
        }
    }
};

Wtf.Shadow.Pool = function(){
    var p = [];
    var markup = Wtf.isIE ?
                 '<div class="x-ie-shadow"></div>' :
                 '<div class="x-shadow"><div class="xst"><div class="xstl"></div><div class="xstc"></div><div class="xstr"></div></div><div class="xsc"><div class="xsml"></div><div class="xsmc"></div><div class="xsmr"></div></div><div class="xsb"><div class="xsbl"></div><div class="xsbc"></div><div class="xsbr"></div></div></div>';
    return {
        pull : function(){
            var sh = p.shift();
            if(!sh){
                sh = Wtf.get(Wtf.DomHelper.insertHtml("beforeBegin", document.body.firstChild, markup));
                sh.autoBoxAdjust = false;
            }
            return sh;
        },

        push : function(sh){
            p.push(sh);
        }
    };
}();

Wtf.BoxComponent = Wtf.extend(Wtf.Component, {
    
    
    
    
    

    initComponent : function(){
        Wtf.BoxComponent.superclass.initComponent.call(this);
        this.addEvents(
            
            'resize',
            
            'move'
        );
    },

        boxReady : false,
        deferHeight: false,

    
    setSize : function(w, h){
                if(typeof w == 'object'){
            h = w.height;
            w = w.width;
        }
                if(!this.boxReady){
            this.width = w;
            this.height = h;
            return this;
        }

                if(this.lastSize && this.lastSize.width == w && this.lastSize.height == h){
            return this;
        }
        this.lastSize = {width: w, height: h};
        var adj = this.adjustSize(w, h);
        var aw = adj.width, ah = adj.height;
        if(aw !== undefined || ah !== undefined){             var rz = this.getResizeEl();
            if(!this.deferHeight && aw !== undefined && ah !== undefined){
                rz.setSize(aw, ah);
            }else if(!this.deferHeight && ah !== undefined){
                rz.setHeight(ah);
            }else if(aw !== undefined){
                rz.setWidth(aw);
            }
            this.onResize(aw, ah, w, h);
            this.fireEvent('resize', this, aw, ah, w, h);
        }
        return this;
    },

    
    setWidth : function(width){
        return this.setSize(width);
    },

    
    setHeight : function(height){
        return this.setSize(undefined, height);
    },

    
    getSize : function(){
        return this.el.getSize();
    },

    
    getPosition : function(local){
        if(local === true){
            return [this.el.getLeft(true), this.el.getTop(true)];
        }
        return this.xy || this.el.getXY();
    },

    
    getBox : function(local){
        var s = this.el.getSize();
        if(local === true){
            s.x = this.el.getLeft(true);
            s.y = this.el.getTop(true);
        }else{
            var xy = this.xy || this.el.getXY();
            s.x = xy[0];
            s.y = xy[1];
        }
        return s;
    },

    
    updateBox : function(box){
        this.setSize(box.width, box.height);
        this.setPagePosition(box.x, box.y);
        return this;
    },

        getResizeEl : function(){
        return this.resizeEl || this.el;
    },

        getPositionEl : function(){
        return this.positionEl || this.el;
    },

    
    setPosition : function(x, y){
        if(x && typeof x[1] == 'number'){
            y = x[1];
            x = x[0];
        }
        this.x = x;
        this.y = y;
        if(!this.boxReady){
            return this;
        }
        var adj = this.adjustPosition(x, y);
        var ax = adj.x, ay = adj.y;

        var el = this.getPositionEl();
        if(ax !== undefined || ay !== undefined){
            if(ax !== undefined && ay !== undefined){
                el.setLeftTop(ax, ay);
            }else if(ax !== undefined){
                el.setLeft(ax);
            }else if(ay !== undefined){
                el.setTop(ay);
            }
            this.onPosition(ax, ay);
            this.fireEvent('move', this, ax, ay);
        }
        return this;
    },

    
    setPagePosition : function(x, y){
        if(x && typeof x[1] == 'number'){
            y = x[1];
            x = x[0];
        }
        this.pageX = x;
        this.pageY = y;
        if(!this.boxReady){
            return;
        }
        if(x === undefined || y === undefined){             return;
        }
        var p = this.el.translatePoints(x, y);
        this.setPosition(p.left, p.top);
        return this;
    },

        onRender : function(ct, position){
        Wtf.BoxComponent.superclass.onRender.call(this, ct, position);
        if(this.resizeEl){
            this.resizeEl = Wtf.get(this.resizeEl);
        }
        if(this.positionEl){
            this.positionEl = Wtf.get(this.positionEl);
        }
    },

        afterRender : function(){
        Wtf.BoxComponent.superclass.afterRender.call(this);
        this.boxReady = true;
        this.setSize(this.width, this.height);
        if(this.x || this.y){
            this.setPosition(this.x, this.y);
        }else if(this.pageX || this.pageY){
            this.setPagePosition(this.pageX, this.pageY);
        }
    },

    
    syncSize : function(){
        delete this.lastSize;
        this.setSize(this.autoWidth ? undefined : this.el.getWidth(), this.autoHeight ? undefined : this.el.getHeight());
        return this;
    },

    
    onResize : function(adjWidth, adjHeight, rawWidth, rawHeight){

    },

    
    onPosition : function(x, y){

    },

        adjustSize : function(w, h){
        if(this.autoWidth){
            w = 'auto';
        }
        if(this.autoHeight){
            h = 'auto';
        }
        return {width : w, height: h};
    },

        adjustPosition : function(x, y){
        return {x : x, y: y};
    }
});
Wtf.reg('box', Wtf.BoxComponent);

Wtf.SplitBar = function(dragElement, resizingElement, orientation, placement, existingProxy){
    
    
    this.el = Wtf.get(dragElement, true);
    this.el.dom.unselectable = "on";
    
    this.resizingEl = Wtf.get(resizingElement, true);

    
    this.orientation = orientation || Wtf.SplitBar.HORIZONTAL;
    
    
    this.minSize = 0;
    
    
    this.maxSize = 2000;
    
    
    this.animate = false;
    
    
    this.useShim = false;
    
    
    this.shim = null;
    
    if(!existingProxy){
        
        this.proxy = Wtf.SplitBar.createProxy(this.orientation);
    }else{
        this.proxy = Wtf.get(existingProxy).dom;
    }
    
    this.dd = new Wtf.dd.DDProxy(this.el.dom.id, "XSplitBars", {dragElId : this.proxy.id});
    
    
    this.dd.b4StartDrag = this.onStartProxyDrag.createDelegate(this);
    
    
    this.dd.endDrag = this.onEndProxyDrag.createDelegate(this);
    
    
    this.dragSpecs = {};
    
    
    this.adapter = new Wtf.SplitBar.BasicLayoutAdapter();
    this.adapter.init(this);
    
    if(this.orientation == Wtf.SplitBar.HORIZONTAL){
        
        this.placement = placement || (this.el.getX() > this.resizingEl.getX() ? Wtf.SplitBar.LEFT : Wtf.SplitBar.RIGHT);
        this.el.addClass("x-splitbar-h");
    }else{
        
        this.placement = placement || (this.el.getY() > this.resizingEl.getY() ? Wtf.SplitBar.TOP : Wtf.SplitBar.BOTTOM);
        this.el.addClass("x-splitbar-v");
    }
    
    this.addEvents(
        
        "resize",
        
        "moved",
        
        "beforeresize",

        "beforeapply"
    );

    Wtf.SplitBar.superclass.constructor.call(this);
};

Wtf.extend(Wtf.SplitBar, Wtf.util.Observable, {
    onStartProxyDrag : function(x, y){
        this.fireEvent("beforeresize", this);
        this.overlay =  Wtf.DomHelper.append(document.body,  {cls: "x-drag-overlay", html: "&#160;"}, true);
        this.overlay.unselectable();
        this.overlay.setSize(Wtf.lib.Dom.getViewWidth(true), Wtf.lib.Dom.getViewHeight(true));
        this.overlay.show();
        Wtf.get(this.proxy).setDisplayed("block");
        var size = this.adapter.getElementSize(this);
        this.activeMinSize = this.getMinimumSize();;
        this.activeMaxSize = this.getMaximumSize();;
        var c1 = size - this.activeMinSize;
        var c2 = Math.max(this.activeMaxSize - size, 0);
        if(this.orientation == Wtf.SplitBar.HORIZONTAL){
            this.dd.resetConstraints();
            this.dd.setXConstraint(
                this.placement == Wtf.SplitBar.LEFT ? c1 : c2, 
                this.placement == Wtf.SplitBar.LEFT ? c2 : c1
            );
            this.dd.setYConstraint(0, 0);
        }else{
            this.dd.resetConstraints();
            this.dd.setXConstraint(0, 0);
            this.dd.setYConstraint(
                this.placement == Wtf.SplitBar.TOP ? c1 : c2, 
                this.placement == Wtf.SplitBar.TOP ? c2 : c1
            );
         }
        this.dragSpecs.startSize = size;
        this.dragSpecs.startPoint = [x, y];
        Wtf.dd.DDProxy.prototype.b4StartDrag.call(this.dd, x, y);
    },
    
    
    onEndProxyDrag : function(e){
        Wtf.get(this.proxy).setDisplayed(false);
        var endPoint = Wtf.lib.Event.getXY(e);
        if(this.overlay){
            this.overlay.remove();
            delete this.overlay;
        }
        var newSize;
        if(this.orientation == Wtf.SplitBar.HORIZONTAL){
            newSize = this.dragSpecs.startSize + 
                (this.placement == Wtf.SplitBar.LEFT ?
                    endPoint[0] - this.dragSpecs.startPoint[0] :
                    this.dragSpecs.startPoint[0] - endPoint[0]
                );
        }else{
            newSize = this.dragSpecs.startSize + 
                (this.placement == Wtf.SplitBar.TOP ?
                    endPoint[1] - this.dragSpecs.startPoint[1] :
                    this.dragSpecs.startPoint[1] - endPoint[1]
                );
        }
        newSize = Math.min(Math.max(newSize, this.activeMinSize), this.activeMaxSize);
        if(newSize != this.dragSpecs.startSize){
            if(this.fireEvent('beforeapply', this, newSize) !== false){
                this.adapter.setElementSize(this, newSize);
                this.fireEvent("moved", this, newSize);
                this.fireEvent("resize", this, newSize);
            }
        }
    },
    
    
    getAdapter : function(){
        return this.adapter;
    },
    
    
    setAdapter : function(adapter){
        this.adapter = adapter;
        this.adapter.init(this);
    },
    
    
    getMinimumSize : function(){
        return this.minSize;
    },
    
    
    setMinimumSize : function(minSize){
        this.minSize = minSize;
    },
    
    
    getMaximumSize : function(){
        return this.maxSize;
    },
    
    
    setMaximumSize : function(maxSize){
        this.maxSize = maxSize;
    },
    
    
    setCurrentSize : function(size){
        var oldAnimate = this.animate;
        this.animate = false;
        this.adapter.setElementSize(this, size);
        this.animate = oldAnimate;
    },
    
    
    destroy : function(removeEl){
        if(this.shim){
            this.shim.remove();
        }
        this.dd.unreg();
        Wtf.removeNode(this.proxy);
        if(removeEl){
            this.el.remove();
        }
    }
});


Wtf.SplitBar.createProxy = function(dir){
    var proxy = new Wtf.Element(document.createElement("div"));
    proxy.unselectable();
    var cls = 'x-splitbar-proxy';
    proxy.addClass(cls + ' ' + (dir == Wtf.SplitBar.HORIZONTAL ? cls +'-h' : cls + '-v'));
    document.body.appendChild(proxy.dom);
    return proxy.dom;
};


Wtf.SplitBar.BasicLayoutAdapter = function(){
};

Wtf.SplitBar.BasicLayoutAdapter.prototype = {
    
    init : function(s){
    
    },
    
     getElementSize : function(s){
        if(s.orientation == Wtf.SplitBar.HORIZONTAL){
            return s.resizingEl.getWidth();
        }else{
            return s.resizingEl.getHeight();
        }
    },
    
    
    setElementSize : function(s, newSize, onComplete){
        if(s.orientation == Wtf.SplitBar.HORIZONTAL){
            if(!s.animate){
                s.resizingEl.setWidth(newSize);
                if(onComplete){
                    onComplete(s, newSize);
                }
            }else{
                s.resizingEl.setWidth(newSize, true, .1, onComplete, 'easeOut');
            }
        }else{
            
            if(!s.animate){
                s.resizingEl.setHeight(newSize);
                if(onComplete){
                    onComplete(s, newSize);
                }
            }else{
                s.resizingEl.setHeight(newSize, true, .1, onComplete, 'easeOut');
            }
        }
    }
};


Wtf.SplitBar.AbsoluteLayoutAdapter = function(container){
    this.basic = new Wtf.SplitBar.BasicLayoutAdapter();
    this.container = Wtf.get(container);
};

Wtf.SplitBar.AbsoluteLayoutAdapter.prototype = {
    init : function(s){
        this.basic.init(s);
    },
    
    getElementSize : function(s){
        return this.basic.getElementSize(s);
    },
    
    setElementSize : function(s, newSize, onComplete){
        this.basic.setElementSize(s, newSize, this.moveSplitter.createDelegate(this, [s]));
    },
    
    moveSplitter : function(s){
        var yes = Wtf.SplitBar;
        switch(s.placement){
            case yes.LEFT:
                s.el.setX(s.resizingEl.getRight());
                break;
            case yes.RIGHT:
                s.el.setStyle("right", (this.container.getWidth() - s.resizingEl.getLeft()) + "px");
                break;
            case yes.TOP:
                s.el.setY(s.resizingEl.getBottom());
                break;
            case yes.BOTTOM:
                s.el.setY(s.resizingEl.getTop() - s.el.getHeight());
                break;
        }
    }
};


Wtf.SplitBar.VERTICAL = 1;


Wtf.SplitBar.HORIZONTAL = 2;


Wtf.SplitBar.LEFT = 1;


Wtf.SplitBar.RIGHT = 2;


Wtf.SplitBar.TOP = 3;


Wtf.SplitBar.BOTTOM = 4;


Wtf.Container = Wtf.extend(Wtf.BoxComponent, {
    
    
    
    
    
    
    

    
    autoDestroy: true,
    
    
    defaultType: 'panel',

        initComponent : function(){
        Wtf.Container.superclass.initComponent.call(this);

        this.addEvents(
            
            'afterlayout',
            
            'beforeadd',
            
            'beforeremove',
            
            'add',
            
            'remove'
        );

        
        var items = this.items;
        if(items){
            delete this.items;
            if(items instanceof Array){
                this.add.apply(this, items);
            }else{
                this.add(items);
            }
        }
    },

        initItems : function(){
        if(!this.items){
            this.items = new Wtf.util.MixedCollection(false, this.getComponentId);
            this.getLayout();         }
    },

        setLayout : function(layout){
        if(this.layout && this.layout != layout){
            this.layout.setContainer(null);
        }
        this.initItems();
        this.layout = layout;
        layout.setContainer(this);
    },

        render : function(){
        Wtf.Container.superclass.render.apply(this, arguments);
        if(this.layout){
            if(typeof this.layout == 'string'){
                this.layout = new Wtf.Container.LAYOUTS[this.layout.toLowerCase()](this.layoutConfig);
            }
            this.setLayout(this.layout);

            if(this.activeItem !== undefined){
                var item = this.activeItem;
                delete this.activeItem;
                this.layout.setActiveItem(item);
                return;
            }
        }
        if(!this.ownerCt){
            this.doLayout();
        }
        if(this.monitorResize === true){
            Wtf.EventManager.onWindowResize(this.doLayout, this);
        }
    },

        getLayoutTarget : function(){
        return this.el;
    },

        getComponentId : function(comp){
        return comp.itemId || comp.id;
    },

    
    add : function(comp){
        if(!this.items){
            this.initItems();
        }
        var a = arguments, len = a.length;
        if(len > 1){
            for(var i = 0; i < len; i++) {
                this.add(a[i]);
            }
            return;
        }
        var c = this.lookupComponent(this.applyDefaults(comp));
        var pos = this.items.length;
        if(this.fireEvent('beforeadd', this, c, pos) !== false && this.onBeforeAdd(c) !== false){
            this.items.add(c);
            c.ownerCt = this;
            this.fireEvent('add', this, c, pos);
        }
        return c;
    },

    
    insert : function(index, comp){
        if(!this.items){
            this.initItems();
        }
        var a = arguments, len = a.length;
        if(len > 2){
            for(var i = len-1; i >= 1; --i) {
                this.insert(index, a[i]);
            }
            return;
        }
        var c = this.lookupComponent(this.applyDefaults(comp));

        if(c.ownerCt == this && this.items.indexOf(c) < index){
            --index;
        }

        if(this.fireEvent('beforeadd', this, c, index) !== false && this.onBeforeAdd(c) !== false){
            this.items.insert(index, c);
            c.ownerCt = this;
            this.fireEvent('add', this, c, index);
        }
        return c;
    },

        applyDefaults : function(c){
        if(this.defaults){
            if(typeof c == 'string'){
                c = Wtf.ComponentMgr.get(c);
                Wtf.apply(c, this.defaults);
            }else if(!c.events){
                Wtf.applyIf(c, this.defaults);
            }else{
                Wtf.apply(c, this.defaults);
            }
        }
        return c;
    },

        onBeforeAdd : function(item){
        if(item.ownerCt){
            item.ownerCt.remove(item, false);
        }
        if(this.hideBorders === true){
            item.border = (item.border === true);
        }
    },

    
    remove : function(comp, autoDestroy){
        var c = this.getComponent(comp);
        if(c && this.fireEvent('beforeremove', this, c) !== false){
            this.items.remove(c);
            delete c.ownerCt;
            if(autoDestroy === true || (autoDestroy !== false && this.autoDestroy)){
                c.destroy();
            }
            if(this.layout && this.layout.activeItem == c){
                delete this.layout.activeItem;
            }
            this.fireEvent('remove', this, c);
        }
        return c;
    },

    
    getComponent : function(comp){
        if(typeof comp == 'object'){
            return comp;
        }
        return this.items.get(comp);
    },

        lookupComponent : function(comp){
        if(typeof comp == 'string'){
            return Wtf.ComponentMgr.get(comp);
        }else if(!comp.events){
            return this.createComponent(comp);
        }
        return comp;
    },

        createComponent : function(config){
        return Wtf.ComponentMgr.create(config, this.defaultType);
    },

    
    doLayout : function(){
        if(this.rendered && this.layout){
            this.layout.layout();
        }
        if(this.items){
            var cs = this.items.items;
            for(var i = 0, len = cs.length; i < len; i++) {
                var c  = cs[i];
                if(c.doLayout){
                    c.doLayout();
                }
            }
        }
    },

    
    getLayout : function(){
        if(!this.layout){
            var layout = new Wtf.layout.ContainerLayout(this.layoutConfig);
            this.setLayout(layout);
        }
        return this.layout;
    },

        onDestroy : function(){
        if(this.items){
            var cs = this.items.items;
            for(var i = 0, len = cs.length; i < len; i++) {
                Wtf.destroy(cs[i]);
            }
        }
        if(this.monitorResize){
            Wtf.EventManager.removeResizeListener(this.doLayout, this);
        }
        Wtf.Container.superclass.onDestroy.call(this);
    },

    
    bubble : function(fn, scope, args){
        var p = this;
        while(p){
            if(fn.apply(scope || p, args || [p]) === false){
                break;
            }
            p = p.ownerCt;
        }
    },

    
    cascade : function(fn, scope, args){
        if(fn.apply(scope || this, args || [this]) !== false){
            if(this.items){
                var cs = this.items.items;
                for(var i = 0, len = cs.length; i < len; i++){
                    if(cs[i].cascade){
                        cs[i].cascade(fn, scope, args);
                    }else{
                        fn.apply(scope || this, args || [cs[i]]);
                    }
                }
            }
        }
    },

    
    findById : function(id){
        var m, ct = this;
        this.cascade(function(c){
            if(ct != c && c.id === id){
                m = c;
                return false;
            }
        });
        return m || null;
    },

    
    findByType : function(xtype){
        return typeof xtype == 'function' ?
            this.findBy(function(c){
                return c.constructor === xtype;
            }) :
            this.findBy(function(c){
                return c.constructor.xtype === xtype;
            });
    },

    
    find : function(prop, value){
        return this.findBy(function(c){
            return c[prop] === value;
        });
    },

    
    findBy : function(fn, scope){
        var m = [], ct = this;
        this.cascade(function(c){
            if(ct != c && fn.call(scope || c, c, ct) === true){
                m.push(c);
            }
        });
        return m;
    }
});

Wtf.Container.LAYOUTS = {};
Wtf.reg('container', Wtf.Container);

Wtf.layout.ContainerLayout = function(config){
    Wtf.apply(this, config);
};

Wtf.layout.ContainerLayout.prototype = {
    
    

    

        monitorResize:false,
        activeItem : null,

        layout : function(){
        var target = this.container.getLayoutTarget();
        this.onLayout(this.container, target);
        this.container.fireEvent('afterlayout', this.container, this);
    },

        onLayout : function(ct, target){
        this.renderAll(ct, target);
    },

        isValidParent : function(c, target){
		var el = c.getPositionEl ? c.getPositionEl() : c.getEl();
		return el.dom.parentNode == target.dom;
    },

        renderAll : function(ct, target){
        var items = ct.items.items;
        for(var i = 0, len = items.length; i < len; i++) {
            var c = items[i];
            if(c && (!c.rendered || !this.isValidParent(c, target))){
                this.renderItem(c, i, target);
            }
        }
    },

        renderItem : function(c, position, target){
        if(c && !c.rendered){
            if(this.extraCls){
                c.addClass(this.extraCls);
            }
            c.render(target, position);
            if (this.renderHidden && c != this.activeItem) {
                c.hide();
            }
        }else if(c && !this.isValidParent(c, target)){
            if(this.extraCls){
                c.addClass(this.extraCls);
            }
            if(typeof position == 'number'){
                position = target.dom.childNodes[position];
            }
            target.dom.insertBefore(c.getEl().dom, position || null);
            if (this.renderHidden && c != this.activeItem) {
                c.hide();
            }
        }
    },

        onResize: function(){
        if(this.container.collapsed){
            return;
        }
        var b = this.container.bufferResize;
        if(b){
            if(!this.resizeTask){
                this.resizeTask = new Wtf.util.DelayedTask(this.layout, this);
                this.resizeBuffer = typeof b == 'number' ? b : 100;
            }
            this.resizeTask.delay(this.resizeBuffer);
        }else{
            this.layout();
        }
    },

        setContainer : function(ct){
        if(this.monitorResize && ct != this.container){
            if(this.container){
                this.container.un('resize', this.onResize, this);
            }
            if(ct){
                ct.on('resize', this.onResize, this);
            }
        }
        this.container = ct;
    },

        parseMargins : function(v){
        var ms = v.split(' ');
        var len = ms.length;
        if(len == 1){
            ms[1] = ms[0];
            ms[2] = ms[0];
            ms[3] = ms[0];
        }
        if(len == 2){
            ms[2] = ms[0];
            ms[3] = ms[1];
        }
        return {
            top:parseInt(ms[0], 10) || 0,
            right:parseInt(ms[1], 10) || 0,
            bottom:parseInt(ms[2], 10) || 0,
            left:parseInt(ms[3], 10) || 0
        };
    }
};
Wtf.Container.LAYOUTS['auto'] = Wtf.layout.ContainerLayout;

Wtf.layout.FitLayout = Wtf.extend(Wtf.layout.ContainerLayout, {
    
    monitorResize:true,

    
    onLayout : function(ct, target){
        Wtf.layout.FitLayout.superclass.onLayout.call(this, ct, target);
        if(!this.container.collapsed){
            this.setItemSize(this.activeItem || ct.items.itemAt(0), target.getStyleSize());
        }
    },

    
    setItemSize : function(item, size){
        if(item && size.height > 0){ 
            item.setSize(size);
        }
    }
});
Wtf.Container.LAYOUTS['fit'] = Wtf.layout.FitLayout;

Wtf.layout.CardLayout = Wtf.extend(Wtf.layout.FitLayout, {
    
    deferredRender : false,

    
    renderHidden : true,

    
    setActiveItem : function(item){
        item = this.container.getComponent(item);
        if(this.activeItem != item){
            if(this.activeItem){
                this.activeItem.hide();
            }
            this.activeItem = item;
            item.show();
            this.layout();
        }
    },

    
    renderAll : function(ct, target){
        if(this.deferredRender){
            this.renderItem(this.activeItem, undefined, target);
        }else{
            Wtf.layout.CardLayout.superclass.renderAll.call(this, ct, target);
        }
    }
});
Wtf.Container.LAYOUTS['card'] = Wtf.layout.CardLayout;

Wtf.layout.AnchorLayout = Wtf.extend(Wtf.layout.ContainerLayout, {
    
    monitorResize:true,

    
    getAnchorViewSize : function(ct, target){
        return target.dom == document.body ?
                   target.getViewSize() : target.getStyleSize();
    },

    
    onLayout : function(ct, target){
        Wtf.layout.AnchorLayout.superclass.onLayout.call(this, ct, target);

        var size = this.getAnchorViewSize(ct, target);

        var w = size.width, h = size.height;

        if(w < 20 || h < 20){
            return;
        }

        
        var aw, ah;
        if(ct.anchorSize){
            if(typeof ct.anchorSize == 'number'){
                aw = ct.anchorSize;
            }else{
                aw = ct.anchorSize.width;
                ah = ct.anchorSize.height;
            }
        }else{
            aw = ct.initialConfig.width;
            ah = ct.initialConfig.height;
        }

        var cs = ct.items.items, len = cs.length, i, c, a, cw, ch;
        for(i = 0; i < len; i++){
            c = cs[i];
            if(c.anchor){
                a = c.anchorSpec;
                if(!a){ 
                    var vs = c.anchor.split(' ');
                    c.anchorSpec = a = {
                        right: this.parseAnchor(vs[0], c.initialConfig.width, aw),
                        bottom: this.parseAnchor(vs[1], c.initialConfig.height, ah)
                    };
                }
                cw = a.right ? this.adjustWidthAnchor(a.right(w), c) : undefined;
                ch = a.bottom ? this.adjustHeightAnchor(a.bottom(h), c) : undefined;

                if(cw || ch){
                    c.setSize(cw || undefined, ch || undefined);
                }
            }
        }
    },

    
    parseAnchor : function(a, start, cstart){
        if(a && a != 'none'){
            var last;
            if(/^(r|right|b|bottom)$/i.test(a)){   
                var diff = cstart - start;
                return function(v){
                    if(v !== last){
                        last = v;
                        return v - diff;
                    }
                }
            }else if(a.indexOf('%') != -1){
                var ratio = parseFloat(a.replace('%', ''))*.01;   
                return function(v){
                    if(v !== last){
                        last = v;
                        return Math.floor(v*ratio);
                    }
                }
            }else{
                a = parseInt(a, 10);
                if(!isNaN(a)){                            
                    return function(v){
                        if(v !== last){
                            last = v;
                            return v + a;
                        }
                    }
                }
            }
        }
        return false;
    },

    
    adjustWidthAnchor : function(value, comp){
        return value;
    },

    
    adjustHeightAnchor : function(value, comp){
        return value;
    }
    
    
});
Wtf.Container.LAYOUTS['anchor'] = Wtf.layout.AnchorLayout;

Wtf.layout.ColumnLayout = Wtf.extend(Wtf.layout.ContainerLayout, {
    
    monitorResize:true,
    
    extraCls: 'x-column',

    scrollOffset : 0,

    
    isValidParent : function(c, target){
        return c.getEl().dom.parentNode == this.innerCt.dom;
    },

    
    onLayout : function(ct, target){
        var cs = ct.items.items, len = cs.length, c, i;

        if(!this.innerCt){
            target.addClass('x-column-layout-ct');

            
            
            this.innerCt = target.createChild({cls:'x-column-inner'});

            this.renderAll(ct, this.innerCt);

            this.innerCt.createChild({cls:'x-clear'});

        }

        var size = target.getViewSize();

        if(size.width < 1 && size.height < 1){ 
            return;
        }

        var w = size.width - target.getPadding('lr') - this.scrollOffset,
            h = size.height - target.getPadding('tb'),
            pw = w;

        this.innerCt.setWidth(w);
        
        
        

        for(i = 0; i < len; i++){
            c = cs[i];
            if(!c.columnWidth){
                pw -= (c.getSize().width + c.getEl().getMargins('lr'));
            }
        }

        pw = pw < 0 ? 0 : pw;

        for(i = 0; i < len; i++){
            c = cs[i];
            if(c.columnWidth){
                c.setSize(Math.floor(c.columnWidth*pw) - c.getEl().getMargins('lr'));
            }
        }
    }
    
    
});

Wtf.Container.LAYOUTS['column'] = Wtf.layout.ColumnLayout;

Wtf.layout.BorderLayout = Wtf.extend(Wtf.layout.ContainerLayout, {
        monitorResize:true,
        rendered : false,

        onLayout : function(ct, target){
        var collapsed;
        if(!this.rendered){
            target.position();
            target.addClass('x-border-layout-ct');
            var items = ct.items.items;
            collapsed = [];
            for(var i = 0, len = items.length; i < len; i++) {
                var c = items[i];
                var pos = c.region;
                if(c.collapsed){
                    collapsed.push(c);
                }
                c.collapsed = false;
                if(!c.rendered){
                    c.cls = c.cls ? c.cls +' x-border-panel' : 'x-border-panel';
                    c.render(target, i);
                }
                this[pos] = pos != 'center' && c.split ?
                    new Wtf.layout.BorderLayout.SplitRegion(this, c.initialConfig, pos) :
                    new Wtf.layout.BorderLayout.Region(this, c.initialConfig, pos);
                this[pos].render(target, c);
            }
            this.rendered = true;
        }

        var size = target.getViewSize();
        if(size.width < 20 || size.height < 20){             if(collapsed){
                this.restoreCollapsed = collapsed;
            }
            return;
        }else if(this.restoreCollapsed){
            collapsed = this.restoreCollapsed;
            delete this.restoreCollapsed;
        }

        var w = size.width, h = size.height;
        var centerW = w, centerH = h, centerY = 0, centerX = 0;

        var n = this.north, s = this.south, west = this.west, e = this.east, c = this.center;
        if(!c){
            throw 'No center region defined in BorderLayout ' + ct.id;
        }

        if(n && n.isVisible()){
            var b = n.getSize();
            var m = n.getMargins();
            b.width = w - (m.left+m.right);
            b.x = m.left;
            b.y = m.top;
            centerY = b.height + b.y + m.bottom;
            centerH -= centerY;
            n.applyLayout(b);
        }
        if(s && s.isVisible()){
            var b = s.getSize();
            var m = s.getMargins();
            b.width = w - (m.left+m.right);
            b.x = m.left;
            var totalHeight = (b.height + m.top + m.bottom);
            b.y = h - totalHeight + m.top;
            centerH -= totalHeight;
            s.applyLayout(b);
        }
        if(west && west.isVisible()){
            var b = west.getSize();
            var m = west.getMargins();
            b.height = centerH - (m.top+m.bottom);
            b.x = m.left;
            b.y = centerY + m.top;
            var totalWidth = (b.width + m.left + m.right);
            centerX += totalWidth;
            centerW -= totalWidth;
            west.applyLayout(b);
        }
        if(e && e.isVisible()){
            var b = e.getSize();
            var m = e.getMargins();
            b.height = centerH - (m.top+m.bottom);
            var totalWidth = (b.width + m.left + m.right);
            b.x = w - totalWidth + m.left;
            b.y = centerY + m.top;
            centerW -= totalWidth;
            e.applyLayout(b);
        }

        var m = c.getMargins();
        var centerBox = {
            x: centerX + m.left,
            y: centerY + m.top,
            width: centerW - (m.left+m.right),
            height: centerH - (m.top+m.bottom)
        };
        c.applyLayout(centerBox);

        if(collapsed){
            for(var i = 0, len = collapsed.length; i < len; i++){
                collapsed[i].collapse(false);
            }
        }

        if(Wtf.isIE && Wtf.isStrict){             target.repaint();
        }
    }
    
    
});


Wtf.layout.BorderLayout.Region = function(layout, config, pos){
    Wtf.apply(this, config);
    this.layout = layout;
    this.position = pos;
    this.state = {};
    if(typeof this.margins == 'string'){
        this.margins = this.layout.parseMargins(this.margins);
    }
    this.margins = Wtf.applyIf(this.margins || {}, this.defaultMargins);
    if(this.collapsible){
        if(typeof this.cmargins == 'string'){
            this.cmargins = this.layout.parseMargins(this.cmargins);
        }
        if(this.collapseMode == 'mini' && !this.cmargins){
            this.cmargins = {left:0,top:0,right:0,bottom:0};
        }else{
            this.cmargins = Wtf.applyIf(this.cmargins || {},
                pos == 'north' || pos == 'south' ? this.defaultNSCMargins : this.defaultEWCMargins);
        }
    }
};

Wtf.layout.BorderLayout.Region.prototype = {
    
    
    
    
    
    
    collapsible : false,
    
    split:false,
    
    floatable: true,
    
    minWidth:50,
    
    minHeight:50,

        defaultMargins : {left:0,top:0,right:0,bottom:0},
        defaultNSCMargins : {left:5,top:5,right:5,bottom:5},
        defaultEWCMargins : {left:5,top:0,right:5,bottom:0},

    
    isCollapsed : false,

    
    
    

        render : function(ct, p){
        this.panel = p;
        p.el.enableDisplayMode();
        this.targetEl = ct;
        this.el = p.el;

        var gs = p.getState, ps = this.position;
        p.getState = function(){
            return Wtf.apply(gs.call(p) || {}, this.state);
        }.createDelegate(this);

        if(ps != 'center'){
            p.allowQueuedExpand = false;
            p.on({
                beforecollapse: this.beforeCollapse,
                collapse: this.onCollapse,
                beforeexpand: this.beforeExpand,
                expand: this.onExpand,
                hide: this.onHide,
                show: this.onShow,
                scope: this
            });
            if(this.collapsible){
                p.collapseEl = 'el';
                p.slideAnchor = this.getSlideAnchor();
            }
            if(p.tools && p.tools.toggle){
                p.tools.toggle.addClass('x-tool-collapse-'+ps);
                p.tools.toggle.addClassOnOver('x-tool-collapse-'+ps+'-over');
            }
        }
    },

        getCollapsedEl : function(){
        if(!this.collapsedEl){
            if(!this.toolTemplate){
                var tt = new Wtf.Template(
                     '<div class="x-tool x-tool-{id}">&#160;</div>'
                );
                tt.disableFormats = true;
                tt.compile();
                Wtf.layout.BorderLayout.Region.prototype.toolTemplate = tt;
            }
            this.collapsedEl = this.targetEl.createChild({
                cls: "x-layout-collapsed x-layout-collapsed-"+this.position
            });
            this.collapsedEl.enableDisplayMode('block');

            if(this.collapseMode == 'mini'){
                this.collapsedEl.addClass('x-layout-cmini-'+this.position);
                this.miniCollapsedEl = this.collapsedEl.createChild({
                    cls: "x-layout-mini x-layout-mini-"+this.position, html: "&#160;"
                });
                this.miniCollapsedEl.addClassOnOver('x-layout-mini-over');
                this.collapsedEl.addClassOnOver("x-layout-collapsed-over");
                this.collapsedEl.on('click', this.onExpandClick, this, {stopEvent:true});
            }else {
                var t = this.toolTemplate.append(
                        this.collapsedEl.dom,
                        {id:'expand-'+this.position}, true);
                t.addClassOnOver('x-tool-expand-'+this.position+'-over');
                t.on('click', this.onExpandClick, this, {stopEvent:true});
                
                if(this.floatable !== false){
                   this.collapsedEl.addClassOnOver("x-layout-collapsed-over");
                   this.collapsedEl.on("click", this.collapseClick, this);
                }
            }
        }
        return this.collapsedEl;
    },

        onExpandClick : function(e){
        if(this.isSlid){
            this.afterSlideIn();
            this.panel.expand(false);
        }else{
            this.panel.expand();
        }
    },

        onCollapseClick : function(e){
        this.panel.collapse();
    },

        beforeCollapse : function(p, animate){
        this.lastAnim = animate;
        if(this.splitEl){
            this.splitEl.hide();
        }
        this.getCollapsedEl().show();
        this.panel.el.setStyle('z-index', 100);
        this.isCollapsed = true;
        this.layout.layout();
    },

        onCollapse : function(animate){
        this.panel.el.setStyle('z-index', 1);
        if(this.lastAnim === false || this.panel.animCollapse === false){
            this.getCollapsedEl().dom.style.visibility = 'visible';
        }else{
            this.getCollapsedEl().slideIn(this.panel.slideAnchor, {duration:.2});
        }
        this.state.collapsed = true;
        this.panel.saveState();
    },

        beforeExpand : function(animate){
        var c = this.getCollapsedEl();
        this.el.show();
        if(this.position == 'east' || this.position == 'west'){
            this.panel.setSize(undefined, c.getHeight());
        }else{
            this.panel.setSize(c.getWidth(), undefined);
        }
        c.hide();
        c.dom.style.visibility = 'hidden';
        this.panel.el.setStyle('z-index', 100);
    },

        onExpand : function(){
        this.isCollapsed = false;
        if(this.splitEl){
            this.splitEl.show();
        }
        this.layout.layout();
        this.panel.el.setStyle('z-index', 1);
        this.state.collapsed = false;
        this.panel.saveState();
    },

        collapseClick : function(e){
        if(this.isSlid){
           e.stopPropagation();
           this.slideIn();
        }else{
           e.stopPropagation();
           this.slideOut();
        }
    },

        onHide : function(){
        if(this.isCollapsed){
            this.getCollapsedEl().hide();
        }else if(this.splitEl){
            this.splitEl.hide();
        }
    },

        onShow : function(){
        if(this.isCollapsed){
            this.getCollapsedEl().show();
        }else if(this.splitEl){
            this.splitEl.show();
        }
    },

    
    isVisible : function(){
        return !this.panel.hidden;
    },

    
    getMargins : function(){
        return this.isCollapsed && this.cmargins ? this.cmargins : this.margins;
    },

    
    getSize : function(){
        return this.isCollapsed ? this.getCollapsedEl().getSize() : this.panel.getSize();
    },

    
    setPanel : function(panel){
        this.panel = panel;
    },

    
    getMinWidth: function(){
        return this.minWidth;
    },

    
    getMinHeight: function(){
        return this.minHeight;
    },

        applyLayoutCollapsed : function(box){
        var ce = this.getCollapsedEl();
        ce.setLeftTop(box.x, box.y);
        ce.setSize(box.width, box.height);
    },

        applyLayout : function(box){
        if(this.isCollapsed){
            this.applyLayoutCollapsed(box);
        }else{
            this.panel.setPosition(box.x, box.y);
            this.panel.setSize(box.width, box.height);
        }
    },

        beforeSlide: function(){
        this.panel.beforeEffect();
    },

        afterSlide : function(){
        this.panel.afterEffect();
    },

        initAutoHide : function(){
        if(this.autoHide !== false){
            if(!this.autoHideHd){
                var st = new Wtf.util.DelayedTask(this.slideIn, this);
                this.autoHideHd = {
                    "mouseout": function(e){
                        if(!e.within(this.el, true)){
                            st.delay(500);
                        }
                    },
                    "mouseover" : function(e){
                        st.cancel();
                    },
                    scope : this
                };
            }
            this.el.on(this.autoHideHd);
        }
    },

        clearAutoHide : function(){
        if(this.autoHide !== false){
            this.el.un("mouseout", this.autoHideHd.mouseout);
            this.el.un("mouseover", this.autoHideHd.mouseover);
        }
    },

        clearMonitor : function(){
        Wtf.getDoc().un("click", this.slideInIf, this);
    },

            slideOut : function(){
        if(this.isSlid || this.el.hasActiveFx()){
            return;
        }
        this.isSlid = true;
        var ts = this.panel.tools;
        if(ts && ts.toggle){
            ts.toggle.hide();
        }
        this.el.show();
        if(this.position == 'east' || this.position == 'west'){
            this.panel.setSize(undefined, this.collapsedEl.getHeight());
        }else{
            this.panel.setSize(this.collapsedEl.getWidth(), undefined);
        }
        this.restoreLT = [this.el.dom.style.left, this.el.dom.style.top];
        this.el.alignTo(this.collapsedEl, this.getCollapseAnchor());
        this.el.setStyle("z-index", 102);
        if(this.animFloat !== false){
            this.beforeSlide();
            this.el.slideIn(this.getSlideAnchor(), {
                callback: function(){
                    this.afterSlide();
                    this.initAutoHide();
                    Wtf.getDoc().on("click", this.slideInIf, this);
                },
                scope: this,
                block: true
            });
        }else{
            this.initAutoHide();
             Wtf.getDoc().on("click", this.slideInIf, this);
        }
    },

        afterSlideIn : function(){
        this.clearAutoHide();
        this.isSlid = false;
        this.clearMonitor();
        this.el.setStyle("z-index", "");
        this.el.dom.style.left = this.restoreLT[0];
        this.el.dom.style.top = this.restoreLT[1];

        var ts = this.panel.tools;
        if(ts && ts.toggle){
            ts.toggle.show();
        }
    },

        slideIn : function(cb){
        if(!this.isSlid || this.el.hasActiveFx()){
            Wtf.callback(cb);
            return;
        }
        this.isSlid = false;
        if(this.animFloat !== false){
            this.beforeSlide();
            this.el.slideOut(this.getSlideAnchor(), {
                callback: function(){
                    this.el.hide();
                    this.afterSlide();
                    this.afterSlideIn();
                    Wtf.callback(cb);
                },
                scope: this,
                block: true
            });
        }else{
            this.el.hide();
            this.afterSlideIn();
        }
    },

        slideInIf : function(e){
        if(!e.within(this.el)){
            this.slideIn();
        }
    },

        anchors : {
        "west" : "left",
        "east" : "right",
        "north" : "top",
        "south" : "bottom"
    },

        sanchors : {
        "west" : "l",
        "east" : "r",
        "north" : "t",
        "south" : "b"
    },

        canchors : {
        "west" : "tl-tr",
        "east" : "tr-tl",
        "north" : "tl-bl",
        "south" : "bl-tl"
    },

        getAnchor : function(){
        return this.anchors[this.position];
    },

        getCollapseAnchor : function(){
        return this.canchors[this.position];
    },

        getSlideAnchor : function(){
        return this.sanchors[this.position];
    },

        getAlignAdj : function(){
        var cm = this.cmargins;
        switch(this.position){
            case "west":
                return [0, 0];
            break;
            case "east":
                return [0, 0];
            break;
            case "north":
                return [0, 0];
            break;
            case "south":
                return [0, 0];
            break;
        }
    },

        getExpandAdj : function(){
        var c = this.collapsedEl, cm = this.cmargins;
        switch(this.position){
            case "west":
                return [-(cm.right+c.getWidth()+cm.left), 0];
            break;
            case "east":
                return [cm.right+c.getWidth()+cm.left, 0];
            break;
            case "north":
                return [0, -(cm.top+cm.bottom+c.getHeight())];
            break;
            case "south":
                return [0, cm.top+cm.bottom+c.getHeight()];
            break;
        }
    }
};


Wtf.layout.BorderLayout.SplitRegion = function(layout, config, pos){
    Wtf.layout.BorderLayout.SplitRegion.superclass.constructor.call(this, layout, config, pos);
        this.applyLayout = this.applyFns[pos];
};

Wtf.extend(Wtf.layout.BorderLayout.SplitRegion, Wtf.layout.BorderLayout.Region, {
    
    splitTip : "Drag to resize.",
    
    collapsibleSplitTip : "Drag to resize. Double click to hide.",
    
    useSplitTips : false,

        splitSettings : {
        north : {
            orientation: Wtf.SplitBar.VERTICAL,
            placement: Wtf.SplitBar.TOP,
            maxFn : 'getVMaxSize',
            minProp: 'minHeight',
            maxProp: 'maxHeight'
        },
        south : {
            orientation: Wtf.SplitBar.VERTICAL,
            placement: Wtf.SplitBar.BOTTOM,
            maxFn : 'getVMaxSize',
            minProp: 'minHeight',
            maxProp: 'maxHeight'
        },
        east : {
            orientation: Wtf.SplitBar.HORIZONTAL,
            placement: Wtf.SplitBar.RIGHT,
            maxFn : 'getHMaxSize',
            minProp: 'minWidth',
            maxProp: 'maxWidth'
        },
        west : {
            orientation: Wtf.SplitBar.HORIZONTAL,
            placement: Wtf.SplitBar.LEFT,
            maxFn : 'getHMaxSize',
            minProp: 'minWidth',
            maxProp: 'maxWidth'
        }
    },

        applyFns : {
        west : function(box){
            if(this.isCollapsed){
                return this.applyLayoutCollapsed(box);
            }
            var sd = this.splitEl.dom, s = sd.style;
            this.panel.setPosition(box.x, box.y);
            var sw = sd.offsetWidth;
            s.left = (box.x+box.width-sw)+'px';
            s.top = (box.y)+'px';
            s.height = Math.max(0, box.height)+'px';
            this.panel.setSize(box.width-sw, box.height);
        },
        east : function(box){
            if(this.isCollapsed){
                return this.applyLayoutCollapsed(box);
            }
            var sd = this.splitEl.dom, s = sd.style;
            var sw = sd.offsetWidth;
            this.panel.setPosition(box.x+sw, box.y);
            s.left = (box.x)+'px';
            s.top = (box.y)+'px';
            s.height = Math.max(0, box.height)+'px';
            this.panel.setSize(box.width-sw, box.height);
        },
        north : function(box){
            if(this.isCollapsed){
                return this.applyLayoutCollapsed(box);
            }
            var sd = this.splitEl.dom, s = sd.style;
            var sh = sd.offsetHeight;
            this.panel.setPosition(box.x, box.y);
            s.left = (box.x)+'px';
            s.top = (box.y+box.height-sh)+'px';
            s.width = Math.max(0, box.width)+'px';
            this.panel.setSize(box.width, box.height-sh);
        },
        south : function(box){
            if(this.isCollapsed){
                return this.applyLayoutCollapsed(box);
            }
            var sd = this.splitEl.dom, s = sd.style;
            var sh = sd.offsetHeight;
            this.panel.setPosition(box.x, box.y+sh);
            s.left = (box.x)+'px';
            s.top = (box.y)+'px';
            s.width = Math.max(0, box.width)+'px';
            this.panel.setSize(box.width, box.height-sh);
        }
    },

        render : function(ct, p){
        Wtf.layout.BorderLayout.SplitRegion.superclass.render.call(this, ct, p);

        var ps = this.position;

        this.splitEl = ct.createChild({
            cls: "x-layout-split x-layout-split-"+ps, html: "&#160;"
        });

        if(this.collapseMode == 'mini'){
            this.miniSplitEl = this.splitEl.createChild({
                cls: "x-layout-mini x-layout-mini-"+ps, html: "&#160;"
            });
            this.miniSplitEl.addClassOnOver('x-layout-mini-over');
            this.miniSplitEl.on('click', this.onCollapseClick, this, {stopEvent:true});
        }

        var s = this.splitSettings[ps];

        this.split = new Wtf.SplitBar(this.splitEl.dom, p.el, s.orientation);
        this.split.placement = s.placement;
        this.split.getMaximumSize = this[s.maxFn].createDelegate(this);
        this.split.minSize = this.minSize || this[s.minProp];
        this.split.on("beforeapply", this.onSplitMove, this);
        this.split.useShim = this.useShim === true;
        this.maxSize = this.maxSize || this[s.maxProp];

        if(p.hidden){
            this.splitEl.hide();
        }

        if(this.useSplitTips){
            this.splitEl.dom.title = this.collapsible ? this.collapsibleSplitTip : this.splitTip;
        }
        if(this.collapsible){
            this.splitEl.on("dblclick", this.onCollapseClick,  this);
        }
    },

        getSize : function(){
        if(this.isCollapsed){
            return this.collapsedEl.getSize();
        }
        var s = this.panel.getSize();
        if(this.position == 'north' || this.position == 'south'){
            s.height += this.splitEl.dom.offsetHeight;
        }else{
            s.width += this.splitEl.dom.offsetWidth;
        }
        return s;
    },

        getHMaxSize : function(){
         var cmax = this.maxSize || 10000;
         var center = this.layout.center;
         return Math.min(cmax, (this.el.getWidth()+center.el.getWidth())-center.getMinWidth());
    },

        getVMaxSize : function(){
        var cmax = this.maxSize || 10000;
        var center = this.layout.center;
        return Math.min(cmax, (this.el.getHeight()+center.el.getHeight())-center.getMinHeight());
    },

        onSplitMove : function(split, newSize){
        var s = this.panel.getSize();
        this.lastSplitSize = newSize;
        if(this.position == 'north' || this.position == 'south'){
            this.panel.setSize(s.width, newSize);
            this.state.height = newSize;
        }else{
            this.panel.setSize(newSize, s.height);
            this.state.width = newSize;
        }
        this.layout.layout();
        this.panel.saveState();
        return false;
    },

    
    getSplitBar : function(){
        return this.split;
    }
});

Wtf.Container.LAYOUTS['border'] = Wtf.layout.BorderLayout;

Wtf.layout.FormLayout = Wtf.extend(Wtf.layout.AnchorLayout, {
    
    
    
    labelSeparator : ':',

        getAnchorViewSize : function(ct, target){
        return ct.body.getStyleSize();
    },

        setContainer : function(ct){
        Wtf.layout.FormLayout.superclass.setContainer.call(this, ct);

        if(ct.labelAlign){
            ct.addClass('x-form-label-'+ct.labelAlign);
        }

        if(ct.hideLabels){
            this.labelStyle = "display:none";
            this.elementStyle = "padding-left:0;";
            this.labelAdjust = 0;
        }else{
            this.labelSeparator = ct.labelSeparator || this.labelSeparator;
            if(typeof ct.labelWidth == 'number'){
                var pad = (typeof ct.labelPad == 'number' ? ct.labelPad : 5);
                this.labelAdjust = ct.labelWidth+pad;
                this.labelStyle = "width:"+ct.labelWidth+"px;";
                this.elementStyle = "padding-left:"+(ct.labelWidth+pad)+'px';
            }
            if(ct.labelAlign == 'top'){
                this.labelStyle = "width:auto;";
                this.labelAdjust = 0;
                this.elementStyle = "padding-left:0;";
            }
        }

        if(!this.fieldTpl){
                        var t = new Wtf.Template(
                '<div class="x-form-item {5}" tabIndex="-1">',
                    '<label for="{0}" style="{2}" class="x-form-item-label">{1}{4}</label>',
                    '<div class="x-form-element" id="x-form-el-{0}" style="{3}">',
                    '</div><div class="{6}"></div>',
                '</div>'
            );
            t.disableFormats = true;
            t.compile();
            Wtf.layout.FormLayout.prototype.fieldTpl = t;
        }
    },

        renderItem : function(c, position, target){
        if(c && !c.rendered && c.isFormField && c.inputType != 'hidden'){
            var args = [
                   c.id, c.fieldLabel,
                   c.labelStyle||this.labelStyle||'',
                   this.elementStyle||'',
                   typeof c.labelSeparator == 'undefined' ? this.labelSeparator : c.labelSeparator,
                   (c.itemCls||this.container.itemCls||'') + (c.hideLabel ? ' x-hide-label' : ''),
                   c.clearCls || 'x-form-clear-left' 
            ];
            if(typeof position == 'number'){
                position = target.dom.childNodes[position] || null;
            }
            if(position){
                this.fieldTpl.insertBefore(position, args);
            }else{
                this.fieldTpl.append(target, args);
            }
            c.render('x-form-el-'+c.id);
        }else {
            Wtf.layout.FormLayout.superclass.renderItem.apply(this, arguments);
        }
    },

        adjustWidthAnchor : function(value, comp){
        return value - (comp.hideLabel ? 0 : this.labelAdjust);
    },

        isValidParent : function(c, target){
        return true;
    }

    
});

Wtf.Container.LAYOUTS['form'] = Wtf.layout.FormLayout;

Wtf.layout.Accordion = Wtf.extend(Wtf.layout.FitLayout, {
    
    fill : true,
    
    autoWidth : true,
    
    titleCollapse : true,
    
    hideCollapseTool : false,
    
    collapseFirst : false,
    
    animate : false,
    
    sequence : false,
    
    activeOnTop : false,

    renderItem : function(c){
        if(this.animate === false){
            c.animCollapse = false;
        }
        c.collapsible = true;
        if(this.autoWidth){
            c.autoWidth = true;
        }
        if(this.titleCollapse){
            c.titleCollapse = true;
        }
        if(this.hideCollapseTool){
            c.hideCollapseTool = true;
        }
        if(this.collapseFirst !== undefined){
            c.collapseFirst = this.collapseFirst;
        }
        if(!this.activeItem && !c.collapsed){
            this.activeItem = c;
        }else if(this.activeItem){
            c.collapsed = true;
        }
        Wtf.layout.Accordion.superclass.renderItem.apply(this, arguments);
        c.header.addClass('x-accordion-hd');
        c.on('beforeexpand', this.beforeExpand, this);
    },

    
    beforeExpand : function(p, anim){
        var ai = this.activeItem;
        if(ai){
            if(this.sequence){
                delete this.activeItem;
                ai.collapse({callback:function(){
                    p.expand(anim || true);
                }, scope: this});
                return false;
            }else{
                ai.collapse(this.animate);
            }
        }
        this.activeItem = p;
        if(this.activeOnTop){
            p.el.dom.parentNode.insertBefore(p.el.dom, p.el.dom.parentNode.firstChild);
        }
        this.layout();
    },

    
    setItemSize : function(item, size){
        if(this.fill && item){
            var items = this.container.items.items;
            var hh = 0;
            for(var i = 0, len = items.length; i < len; i++){
                var p = items[i];
                if(p != item){
                    hh += (p.getSize().height - p.bwrap.getHeight());
                }
            }
            size.height -= hh;
            item.setSize(size);
        }
    }
});
Wtf.Container.LAYOUTS['accordion'] = Wtf.layout.Accordion;

Wtf.layout.TableLayout = Wtf.extend(Wtf.layout.ContainerLayout, {
    

    
    monitorResize:false,

    
    setContainer : function(ct){
        Wtf.layout.TableLayout.superclass.setContainer.call(this, ct);

        this.currentRow = 0;
        this.currentColumn = 0;
        this.spanCells = [];
    },

    
    onLayout : function(ct, target){
        var cs = ct.items.items, len = cs.length, c, i;

        if(!this.table){
            target.addClass('x-table-layout-ct');

            this.table = target.createChild(
                {tag:'table', cls:'x-table-layout', cellspacing: 0, cn: {tag: 'tbody'}}, null, true);

            this.renderAll(ct, target);
        }
    },

    
    getRow : function(index){
        var row = this.table.tBodies[0].childNodes[index];
        if(!row){
            row = document.createElement('tr');
            this.table.tBodies[0].appendChild(row);
        }
        return row;
    },

    
	getNextCell : function(c){
        var td = document.createElement('td'), row, colIndex;
        if(!this.columns){
            row = this.getRow(0);
        }else {
        	colIndex = this.currentColumn;
            if(colIndex !== 0 && (colIndex % this.columns === 0)){
                this.currentRow++;
                colIndex = (c.colspan || 1);
            }else{
                colIndex += (c.colspan || 1);
            }
            
            
            var cell = this.getNextNonSpan(colIndex, this.currentRow);
            this.currentColumn = cell[0];
            if(cell[1] != this.currentRow){
            	
            	this.currentRow = cell[1];
            	if(c.colspan){
            		
            		
            		
            		
            		this.currentColumn += c.colspan - 1;
            	}
            }
            row = this.getRow(this.currentRow);
        }
        if(c.colspan){
            td.colSpan = c.colspan;
        }
		td.className = 'x-table-layout-cell';
        if(c.rowspan){
            td.rowSpan = c.rowspan;
			var rowIndex = this.currentRow, colspan = c.colspan || 1;
			
			for(var r = rowIndex+1; r < rowIndex+c.rowspan; r++){
				for(var col=this.currentColumn-colspan+1; col <= this.currentColumn; col++){
					if(!this.spanCells[col]){
						this.spanCells[col] = [];
					}
					this.spanCells[col][r] = 1;
				}
			}
        }
        row.appendChild(td);
        return td;
    },
    
    
    getNextNonSpan: function(colIndex, rowIndex){
    	var c = (colIndex <= this.columns ? colIndex : this.columns), r = rowIndex;
        for(var i=c; i <= this.columns; i++){
        	if(this.spanCells[i] && this.spanCells[i][r]){
        		if(++c > this.columns){
        			
	                return this.getNextNonSpan(1, ++r);
        		}
        	}else{
        		break;
        	}
        }
        return [c,r];
    },

    
    renderItem : function(c, position, target){
        if(c && !c.rendered){
            c.render(this.getNextCell(c));
        }
    },

    
    isValidParent : function(c, target){
        return true;
    }

    
});

Wtf.Container.LAYOUTS['table'] = Wtf.layout.TableLayout;

Wtf.layout.AbsoluteLayout = Wtf.extend(Wtf.layout.AnchorLayout, {
    extraCls: 'x-abs-layout-item',
    onLayout : function(ct, target){
        target.position();
        Wtf.layout.AbsoluteLayout.superclass.onLayout.call(this, ct, target);
    }
    
});
Wtf.Container.LAYOUTS['absolute'] = Wtf.layout.AbsoluteLayout;

Wtf.Viewport = Wtf.extend(Wtf.Container, {
	
    
    
    
    
    
    
    
    
    
    
    
    initComponent : function() {
        Wtf.Viewport.superclass.initComponent.call(this);
        document.getElementsByTagName('html')[0].className += ' x-viewport';
        this.el = Wtf.getBody();
        this.el.setHeight = Wtf.emptyFn;
        this.el.setWidth = Wtf.emptyFn;
        this.el.setSize = Wtf.emptyFn;
        this.el.dom.scroll = 'no';
        this.allowDomMove = false;
        this.autoWidth = true;
        this.autoHeight = true;
        Wtf.EventManager.onWindowResize(this.fireResize, this);
        this.renderTo = this.el;
    },

    fireResize : function(w, h){
        this.fireEvent('resize', this, w, h, w, h);
    }
});
Wtf.reg('viewport', Wtf.Viewport);

Wtf.Panel = Wtf.extend(Wtf.Container, {
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
 	

    
    baseCls : 'x-panel',
    
    collapsedCls : 'x-panel-collapsed',
    
    maskDisabled: true,
    
    animCollapse: Wtf.enableFx,
    
    headerAsText: true,
    
    buttonAlign: 'right',
    
    collapsed : false,
    
    collapseFirst: true,
    
    minButtonWidth:75,
    
    elements : 'body',

                toolTarget : 'header',
    collapseEl : 'bwrap',
    slideAnchor : 't',

        deferHeight: true,
        expandDefaults: {
        duration:.25
    },
        collapseDefaults: {
        duration:.25
    },

        initComponent : function(){
        Wtf.Panel.superclass.initComponent.call(this);

        this.addEvents(
            
            'bodyresize',
            
            'titlechange',
            
            'collapse',
            
            'expand',
            
            'beforecollapse',
            
            'beforeexpand',
            
            'beforeclose',
            
            'close',
            
            'activate',
            
            'deactivate'
        );

                if(this.tbar){
            this.elements += ',tbar';
            if(typeof this.tbar == 'object'){
                this.topToolbar = this.tbar;
            }
            delete this.tbar;
        }
        if(this.bbar){
            this.elements += ',bbar';
            if(typeof this.bbar == 'object'){
                this.bottomToolbar = this.bbar;
            }
            delete this.bbar;
        }

        if(this.header === true){
            this.elements += ',header';
            delete this.header;
        }else if(this.title && this.header !== false){
            this.elements += ',header';
        }

        if(this.footer === true){
            this.elements += ',footer';
            delete this.footer;
        }

        if(this.buttons){
            var btns = this.buttons;
            
            this.buttons = [];
            for(var i = 0, len = btns.length; i < len; i++) {
                if(btns[i].render){                     this.buttons.push(btns[i]);
                }else{
                    this.addButton(btns[i]);
                }
            }
        }
        if(this.autoLoad){
            this.on('render', this.doAutoLoad, this, {delay:10});
        }
    },

        createElement : function(name, pnode){
        if(this[name]){
            pnode.appendChild(this[name].dom);
            return;
        }

        if(name === 'bwrap' || this.elements.indexOf(name) != -1){
            if(this[name+'Cfg']){
                this[name] = Wtf.fly(pnode).createChild(this[name+'Cfg']);
            }else{
                var el = document.createElement('div');
                el.className = this[name+'Cls'];
                this[name] = Wtf.get(pnode.appendChild(el));
            }
        }
    },

        onRender : function(ct, position){
        Wtf.Panel.superclass.onRender.call(this, ct, position);

        this.createClasses();

        if(this.el){             this.el.addClass(this.baseCls);
            this.header = this.el.down('.'+this.headerCls);
            this.bwrap = this.el.down('.'+this.bwrapCls);
            var cp = this.bwrap ? this.bwrap : this.el;
            this.tbar = cp.down('.'+this.tbarCls);
            this.body = cp.down('.'+this.bodyCls);
            this.bbar = cp.down('.'+this.bbarCls);
            this.footer = cp.down('.'+this.footerCls);
            this.fromMarkup = true;
        }else{
            this.el = ct.createChild({
                id: this.id,
                cls: this.baseCls
            }, position);
        }
        var el = this.el, d = el.dom;

        if(this.cls){
            this.el.addClass(this.cls);
        }

        if(this.buttons){
            this.elements += ',footer';
        }

        
                if(this.frame){
            el.insertHtml('afterBegin', String.format(Wtf.Element.boxMarkup, this.baseCls));

            this.createElement('header', d.firstChild.firstChild.firstChild);
            this.createElement('bwrap', d);

                        var bw = this.bwrap.dom;
            var ml = d.childNodes[1], bl = d.childNodes[2];
            bw.appendChild(ml);
            bw.appendChild(bl);

            var mc = bw.firstChild.firstChild.firstChild;
            this.createElement('tbar', mc);
            this.createElement('body', mc);
            this.createElement('bbar', mc);
            this.createElement('footer', bw.lastChild.firstChild.firstChild);

            if(!this.footer){
                this.bwrap.dom.lastChild.className += ' x-panel-nofooter';
            }
        }else{
            this.createElement('header', d);
            this.createElement('bwrap', d);

                        var bw = this.bwrap.dom;
            this.createElement('tbar', bw);
            this.createElement('body', bw);
            this.createElement('bbar', bw);
            this.createElement('footer', bw);

            if(!this.header){
                this.body.addClass(this.bodyCls + '-noheader');
                if(this.tbar){
                    this.tbar.addClass(this.tbarCls + '-noheader');
                }
            }
        }

        if(this.border === false){
            this.el.addClass(this.baseCls + '-noborder');
            this.body.addClass(this.bodyCls + '-noborder');
            if(this.header){
                this.header.addClass(this.headerCls + '-noborder');
            }
            if(this.footer){
                this.footer.addClass(this.footerCls + '-noborder');
            }
            if(this.tbar){
                this.tbar.addClass(this.tbarCls + '-noborder');
            }
            if(this.bbar){
                this.bbar.addClass(this.bbarCls + '-noborder');
            }
        }

        if(this.bodyBorder === false){
           this.body.addClass(this.bodyCls + '-noborder');
        }

        if(this.bodyStyle){
           this.body.applyStyles(this.bodyStyle);
        }

        this.bwrap.enableDisplayMode('block');

        if(this.header){
            this.header.unselectable();

                        if(this.headerAsText){
                this.header.dom.innerHTML =
                    '<span class="' + this.headerTextCls + '">'+this.header.dom.innerHTML+'</span>';

                if(this.iconCls){
                    this.setIconClass(this.iconCls);
                }
            }
        }

        if(this.floating){
            this.makeFloating(this.floating);
        }

        if(this.collapsible){
            this.tools = this.tools ? this.tools.slice(0) : [];
            if(!this.hideCollapseTool){
                this.tools[this.collapseFirst?'unshift':'push']({
                    id: 'toggle',
                    handler : this.toggleCollapse,
                    scope: this
                });
            }
            if(this.titleCollapse && this.header){
                this.header.on('click', this.toggleCollapse, this);
                this.header.setStyle('cursor', 'pointer');
            }
        }
        if(this.tools){
            var ts = this.tools;
            this.tools = {};
            this.addTool.apply(this, ts);
        }else{
            this.tools = {};
        }

        if(this.buttons && this.buttons.length > 0){
                        var tb = this.footer.createChild({cls:'x-panel-btns-ct', cn: {
                cls:"x-panel-btns x-panel-btns-"+this.buttonAlign,
                html:'<table cellspacing="0"><tbody><tr></tr></tbody></table><div class="x-clear"></div>'
            }}, null, true);
            var tr = tb.getElementsByTagName('tr')[0];
            for(var i = 0, len = this.buttons.length; i < len; i++) {
                var b = this.buttons[i];
                var td = document.createElement('td');
                td.className = 'x-panel-btn-td';
                b.render(tr.appendChild(td));
            }
        }

        if(this.tbar && this.topToolbar){
            if(this.topToolbar instanceof Array){
                this.topToolbar = new Wtf.Toolbar(this.topToolbar);
            }
            this.topToolbar.render(this.tbar);
        }
        if(this.bbar && this.bottomToolbar){
            if(this.bottomToolbar instanceof Array){
                this.bottomToolbar = new Wtf.Toolbar(this.bottomToolbar);
            }
            this.bottomToolbar.render(this.bbar);
        }
    },

    
    setIconClass : function(cls){
        var old = this.iconCls;
        this.iconCls = cls;
        if(this.rendered){
            if(this.frame){
                this.header.addClass('x-panel-icon');
                this.header.replaceClass(old, this.iconCls);
            }else{
                var hd = this.header.dom;
                var img = hd.firstChild && String(hd.firstChild.tagName).toLowerCase() == 'img' ? hd.firstChild : null;
                if(img){
                    Wtf.fly(img).replaceClass(old, this.iconCls);
                }else{
                    Wtf.DomHelper.insertBefore(hd.firstChild, {
                        tag:'img', src: Wtf.BLANK_IMAGE_URL, cls:'x-panel-inline-icon '+this.iconCls
                    });
                 }
            }
        }
    },

        makeFloating : function(cfg){
        this.floating = true;
        this.el = new Wtf.Layer(
            typeof cfg == 'object' ? cfg : {
                shadow: this.shadow !== undefined ? this.shadow : 'sides',
                shadowOffset: this.shadowOffset,
                constrain:false,
                shim: this.shim === false ? false : undefined
            }, this.el
        );
    },

    
    getTopToolbar : function(){
        return this.topToolbar;
    },

    
    getBottomToolbar : function(){
        return this.bottomToolbar;
    },

    
    addButton : function(config, handler, scope){
        var bc = {
            handler: handler,
            scope: scope,
            minWidth: this.minButtonWidth,
            hideParent:true
        };
        if(typeof config == "string"){
            bc.text = config;
        }else{
            Wtf.apply(bc, config);
        }
        var btn = new Wtf.Button(bc);
        if(!this.buttons){
            this.buttons = [];
        }
        this.buttons.push(btn);
        return btn;
    },

        addTool : function(){
        if(!this[this.toolTarget]) {             return;
        }
        if(!this.toolTemplate){
                        var tt = new Wtf.Template(
                 '<div class="x-tool x-tool-{id}">&#160;</div>'
            );
            tt.disableFormats = true;
            tt.compile();
            Wtf.Panel.prototype.toolTemplate = tt;
        }
        for(var i = 0, a = arguments, len = a.length; i < len; i++) {
            var tc = a[i], overCls = 'x-tool-'+tc.id+'-over';
            var t = this.toolTemplate.insertFirst(this[this.toolTarget], tc, true);
            this.tools[tc.id] = t;
            t.enableDisplayMode('block');
            t.on('click', this.createToolHandler(t, tc, overCls, this));
            if(tc.on){
                t.on(tc.on);
            }
            if(tc.hidden){
                t.hide();
            }
            if(tc.qtip){
                if(typeof tc.qtip == 'object'){
                    Wtf.QuickTips.register(Wtf.apply({
                          target: t.id
                    }, tc.qtip));
                } else {
                    t.dom.qtip = tc.qtip;
                }
            }
            t.addClassOnOver(overCls);
        }
    },

        onShow : function(){
        if(this.floating){
            return this.el.show();
        }
        Wtf.Panel.superclass.onShow.call(this);
    },

        onHide : function(){
        if(this.floating){
            return this.el.hide();
        }
        Wtf.Panel.superclass.onHide.call(this);
    },

        createToolHandler : function(t, tc, overCls, panel){
        return function(e){
            t.removeClass(overCls);
            e.stopEvent();
            if(tc.handler){
                tc.handler.call(tc.scope || t, e, t, panel);
            }
        };
    },

        afterRender : function(){
        if(this.fromMarkup && this.height === undefined && !this.autoHeight){
            this.height = this.el.getHeight();
        }
        if(this.floating && !this.hidden && !this.initHidden){
            this.el.show();
        }
        if(this.title){
            this.setTitle(this.title);
        }
        if(this.autoScroll){
            this.body.dom.style.overflow = 'auto';
        }
        if(this.html){
            this.body.update(typeof this.html == 'object' ?
                             Wtf.DomHelper.markup(this.html) :
                             this.html);
            delete this.html;
        }
        if(this.contentEl){
            var ce = Wtf.getDom(this.contentEl);
            Wtf.fly(ce).removeClass(['x-hidden', 'x-hide-display']);
            this.body.dom.appendChild(ce);
        }
        if(this.collapsed){
            this.collapsed = false;
            this.collapse(false);
        }
        Wtf.Panel.superclass.afterRender.call(this);         this.initEvents();
    },

        getKeyMap : function(){
        if(!this.keyMap){
            this.keyMap = new Wtf.KeyMap(this.el, this.keys);
        }
        return this.keyMap;
    },

        initEvents : function(){
        if(this.keys){
            this.getKeyMap();
        }
        if(this.draggable){
            this.initDraggable();
        }
    },

        initDraggable : function(){
        this.dd = new Wtf.Panel.DD(this, typeof this.draggable == 'boolean' ? null : this.draggable);
    },

        beforeEffect : function(){
        if(this.floating){
            this.el.beforeAction();
        }
        this.el.addClass('x-panel-animated');
    },

        afterEffect : function(){
        this.syncShadow();
        this.el.removeClass('x-panel-animated');
    },

        createEffect : function(a, cb, scope){
        var o = {
            scope:scope,
            block:true
        };
        if(a === true){
            o.callback = cb;
            return o;
        }else if(!a.callback){
            o.callback = cb;
        }else {             o.callback = function(){
                cb.call(scope);
                Wtf.callback(a.callback, a.scope);
            };
        }
        return Wtf.applyIf(o, a);
    },

    
    collapse : function(animate){
        if(this.collapsed || this.el.hasFxBlock() || this.fireEvent('beforecollapse', this, animate) === false){
            return;
        }
        var doAnim = animate === true || (animate !== false && this.animCollapse);
        this.beforeEffect();
        this.onCollapse(doAnim, animate);
        return this;
    },

        onCollapse : function(doAnim, animArg){
        if(doAnim){
            this[this.collapseEl].slideOut(this.slideAnchor,
                    Wtf.apply(this.createEffect(animArg||true, this.afterCollapse, this),
                        this.collapseDefaults));
        }else{
            this[this.collapseEl].hide();
            this.afterCollapse();
        }
    },

        afterCollapse : function(){
        this.collapsed = true;
        this.el.addClass(this.collapsedCls);
        this.afterEffect();
        this.fireEvent('collapse', this);
    },

    
    expand : function(animate){
        if(!this.collapsed || this.el.hasFxBlock() || this.fireEvent('beforeexpand', this, animate) === false){
            return;
        }
        var doAnim = animate === true || (animate !== false && this.animCollapse);
        this.el.removeClass(this.collapsedCls);
        this.beforeEffect();
        this.onExpand(doAnim, animate);
        return this;
    },

        onExpand : function(doAnim, animArg){
        if(doAnim){
            this[this.collapseEl].slideIn(this.slideAnchor,
                    Wtf.apply(this.createEffect(animArg||true, this.afterExpand, this),
                        this.expandDefaults));
        }else{
            this[this.collapseEl].show();
            this.afterExpand();
        }
    },

        afterExpand : function(){
        this.collapsed = false;
        this.afterEffect();
        this.fireEvent('expand', this);
    },

    
    toggleCollapse : function(animate){
        this[this.collapsed ? 'expand' : 'collapse'](animate);
        return this;
    },

        onDisable : function(){
        if(this.rendered && this.maskDisabled){
            this.el.mask();
        }
        Wtf.Panel.superclass.onDisable.call(this);
    },

        onEnable : function(){
        if(this.rendered && this.maskDisabled){
            this.el.unmask();
        }
        Wtf.Panel.superclass.onEnable.call(this);
    },

        onResize : function(w, h){
        if(w !== undefined || h !== undefined){
            if(!this.collapsed){
                if(typeof w == 'number'){
                    this.body.setWidth(
                            this.adjustBodyWidth(w - this.getFrameWidth()));
                }else if(w == 'auto'){
                    this.body.setWidth(w);
                }

                if(typeof h == 'number'){
                    this.body.setHeight(
                            this.adjustBodyHeight(h - this.getFrameHeight()));
                }else if(h == 'auto'){
                    this.body.setHeight(h);
                }
            }else{
                this.queuedBodySize = {width: w, height: h};
                if(!this.queuedExpand && this.allowQueuedExpand !== false){
                    this.queuedExpand = true;
                    this.on('expand', function(){
                        delete this.queuedExpand;
                        this.onResize(this.queuedBodySize.width, this.queuedBodySize.height);
                        this.doLayout();
                    }, this, {single:true});
                }
            }
            this.fireEvent('bodyresize', this, w, h);
        }
        this.syncShadow();
    },

        adjustBodyHeight : function(h){
        return h;
    },

        adjustBodyWidth : function(w){
        return w;
    },

        onPosition : function(){
        this.syncShadow();
    },

        onDestroy : function(){
        if(this.tools){
            for(var k in this.tools){
                Wtf.destroy(this.tools[k]);
            }
        }
        if(this.buttons){
            for(var b in this.buttons){
                Wtf.destroy(this.buttons[b]);
            }
        }
        Wtf.destroy(
            this.topToolbar,
            this.bottomToolbar
        );
        Wtf.Panel.superclass.onDestroy.call(this);
    },

    
    getFrameWidth : function(){
        var w = this.el.getFrameWidth('lr');

        if(this.frame){
            var l = this.bwrap.dom.firstChild;
            w += (Wtf.fly(l).getFrameWidth('l') + Wtf.fly(l.firstChild).getFrameWidth('r'));
            var mc = this.bwrap.dom.firstChild.firstChild.firstChild;
            w += Wtf.fly(mc).getFrameWidth('lr');
        }
        return w;
    },

    
    getFrameHeight : function(){
        var h  = this.el.getFrameWidth('tb');
        h += (this.tbar ? this.tbar.getHeight() : 0) +
             (this.bbar ? this.bbar.getHeight() : 0);

        if(this.frame){
            var hd = this.el.dom.firstChild;
            var ft = this.bwrap.dom.lastChild;
            h += (hd.offsetHeight + ft.offsetHeight);
            var mc = this.bwrap.dom.firstChild.firstChild.firstChild;
            h += Wtf.fly(mc).getFrameWidth('tb');
        }else{
            h += (this.header ? this.header.getHeight() : 0) +
                (this.footer ? this.footer.getHeight() : 0);
        }
        return h;
    },

    
    getInnerWidth : function(){
        return this.getSize().width - this.getFrameWidth();
    },

    
    getInnerHeight : function(){
        return this.getSize().height - this.getFrameHeight();
    },

        syncShadow : function(){
        if(this.floating){
            this.el.sync(true);
        }
    },

        getLayoutTarget : function(){
        return this.body;
    },

    
    setTitle : function(title, iconCls){
        this.title = title;
        if(this.header && this.headerAsText){
            this.header.child('span').update(title);
        }
        if(iconCls){
            this.setIconClass(iconCls);
        }
        this.fireEvent('titlechange', this, title);
        return this;
    },

    
    getUpdater : function(){
        return this.body.getUpdater();
    },

     
    load : function(){
        var um = this.body.getUpdater();
        um.update.apply(um, arguments);
        return this;
    },

        beforeDestroy : function(){
        Wtf.Element.uncache(
            this.header,
            this.tbar,
            this.bbar,
            this.footer,
            this.body
        );
    },

        createClasses : function(){
        this.headerCls = this.baseCls + '-header';
        this.headerTextCls = this.baseCls + '-header-text';
        this.bwrapCls = this.baseCls + '-bwrap';
        this.tbarCls = this.baseCls + '-tbar';
        this.bodyCls = this.baseCls + '-body';
        this.bbarCls = this.baseCls + '-bbar';
        this.footerCls = this.baseCls + '-footer';
    },

        createGhost : function(cls, useShim, appendTo){
        var el = document.createElement('div');
        el.className = 'x-panel-ghost ' + (cls ? cls : '');
        if(this.header){
            el.appendChild(this.el.dom.firstChild.cloneNode(true));
        }
        Wtf.fly(el.appendChild(document.createElement('ul'))).setHeight(this.bwrap.getHeight());
        el.style.width = this.el.dom.offsetWidth + 'px';;
        if(!appendTo){
            this.container.dom.appendChild(el);
        }else{
            Wtf.getDom(appendTo).appendChild(el);
        }
        if(useShim !== false && this.el.useShim !== false){
            var layer = new Wtf.Layer({shadow:false, useDisplay:true, constrain:false}, el);
            layer.show();
            return layer;
        }else{
            return new Wtf.Element(el);
        }
    },

        doAutoLoad : function(){
        this.body.load(
            typeof this.autoLoad == 'object' ?
                this.autoLoad : {url: this.autoLoad});
    }
});
Wtf.reg('panel', Wtf.Panel);


Wtf.Window = Wtf.extend(Wtf.Panel, {
    
    
    
    
    
    
    
    baseCls : 'x-window',
    
    resizable:true,
    
    draggable:true,
    
    closable : true,
    
    constrain:false,
    
    constrainHeader:false,
    
    plain:false,
    
    minimizable : false,
    
    maximizable : false,
    
    minHeight: 100,
    
    minWidth: 200,
    
    expandOnShow: true,
    
    closeAction: 'close',

        collapsible:false,

        initHidden : true,
    
    monitorResize : true,

                    
    elements: 'header,body',
    
    frame:true,
    
    floating:true,

        initComponent : function(){
        Wtf.Window.superclass.initComponent.call(this);
        this.addEvents(
            
            
            
            'resize',
            
            'maximize',
            
            'minimize',
            
            'restore'
        );
    },

        getState : function(){
        return Wtf.apply(Wtf.Window.superclass.getState.call(this) || {}, this.getBox());
    },

        onRender : function(ct, position){
        Wtf.Window.superclass.onRender.call(this, ct, position);

        if(this.plain){
            this.el.addClass('x-window-plain');
        }

                this.focusEl = this.el.createChild({
                    tag: "a", href:"#", cls:"x-dlg-focus",
                    tabIndex:"-1", html: "&#160;"});
        this.focusEl.swallowEvent('click', true);

        this.proxy = this.el.createProxy("x-window-proxy");
        this.proxy.enableDisplayMode('block');

        if(this.modal){
            this.mask = this.container.createChild({cls:"wtf-el-mask"}, this.el.dom);
            this.mask.enableDisplayMode("block");
            this.mask.hide();
        }
    },

        initEvents : function(){
        Wtf.Window.superclass.initEvents.call(this);
        if(this.animateTarget){
            this.setAnimateTarget(this.animateTarget);
        }

        if(this.resizable){
            this.resizer = new Wtf.Resizable(this.el, {
                minWidth: this.minWidth,
                minHeight:this.minHeight,
                handles: this.resizeHandles || "all",
                pinned: true,
                resizeElement : this.resizerAction
            });
            this.resizer.window = this;
            this.resizer.on("beforeresize", this.beforeResize, this);
        }

        if(this.draggable){
            this.header.addClass("x-window-draggable");
        }
        this.initTools();

        this.el.on("mousedown", this.toFront, this);
        this.manager = this.manager || Wtf.WindowMgr;
        this.manager.register(this);
        this.hidden = true;
        if(this.maximized){
            this.maximized = false;
            this.maximize();
        }
        if(this.closable){
            var km = this.getKeyMap();
            km.on(27, this.onEsc, this);
            km.disable();
        }
    },

    initDraggable : function(){
        this.dd = new Wtf.Window.DD(this);  
    },

       onEsc : function(){
        this[this.closeAction]();  
    },

        beforeDestroy : function(){
        Wtf.destroy(
            this.resizer,
            this.dd,
            this.proxy
        );
        Wtf.Window.superclass.beforeDestroy.call(this);
    },
    
        onDestroy : function(){
        if(this.manager){
            this.manager.unregister(this);
        }
        Wtf.Window.superclass.onDestroy.call(this);
    },

        initTools : function(){
        if(this.minimizable){
            this.addTool({
                id: 'minimize',
                handler: this.minimize.createDelegate(this, [])
            });
        }
        if(this.maximizable){
            this.addTool({
                id: 'maximize',
                handler: this.maximize.createDelegate(this, [])
            });
            this.addTool({
                id: 'restore',
                handler: this.restore.createDelegate(this, []),
                hidden:true
            });
            this.header.on('dblclick', this.toggleMaximize, this);
        }
        if(this.closable){
            this.addTool({
                id: 'close',
                handler: this[this.closeAction].createDelegate(this, [])
            });
        }
    },

        resizerAction : function(){
        var box = this.proxy.getBox();
        this.proxy.hide();
        this.window.handleResize(box);
        return box;
    },

        beforeResize : function(){
        this.resizer.minHeight = Math.max(this.minHeight, this.getFrameHeight() + 40);         this.resizer.minWidth = Math.max(this.minWidth, this.getFrameWidth() + 40);
        this.resizeBox = this.el.getBox();
    },

        updateHandles : function(){
        if(Wtf.isIE && this.resizer){
            this.resizer.syncHandleHeight();
            this.el.repaint();
        }
    },

        handleResize : function(box){
        var rz = this.resizeBox;
        if(rz.x != box.x || rz.y != box.y){
            this.updateBox(box);
        }else{
            this.setSize(box);
        }
        this.focus();
        this.updateHandles();
        this.saveState();
        this.fireEvent("resize", this, box.width, box.height);
    },

    
    focus : function(){
        var f = this.focusEl, db = this.defaultButton, t = typeof db;
        if(t != 'undefined'){
            if(t == 'number'){
                f = this.buttons[db];
            }else if(t == 'string'){
                f = Wtf.getCmp(db);
            }else{
                f = db;
            }
        }
        f.focus.defer(10, f);
    },

    
    setAnimateTarget : function(el){
        el = Wtf.get(el);
        this.animateTarget = el;
    },

        beforeShow : function(){
        delete this.el.lastXY;
        delete this.el.lastLT;
        if(this.x === undefined || this.y === undefined){
            var xy = this.el.getAlignToXY(this.container, 'c-c');
            var pos = this.el.translatePoints(xy[0], xy[1]);
            this.x = this.x === undefined? pos.left : this.x;
            this.y = this.y === undefined? pos.top : this.y;
        }
        this.el.setLeftTop(this.x, this.y);

        if(this.expandOnShow){
            this.expand(false);
        }

        if(this.modal){
            Wtf.getBody().addClass("x-body-masked");
            this.mask.setSize(Wtf.lib.Dom.getViewWidth(true), Wtf.lib.Dom.getViewHeight(true));
            this.mask.show();
        }
    },

    
    show : function(animateTarget, cb, scope){
        if(!this.rendered){
            this.render(Wtf.getBody());
        }
        if(this.hidden === false){
            this.toFront();
            return;
        }
        if(this.fireEvent("beforeshow", this) === false){
            return;
        }
        if(cb){
            this.on('show', cb, scope, {single:true});
        }
        this.hidden = false;
        if(animateTarget !== undefined){
            this.setAnimateTarget(animateTarget);
        }
        this.beforeShow();
        if(this.animateTarget){
            this.animShow();
        }else{
            this.afterShow();
        }
    },

        afterShow : function(){
        this.proxy.hide();
        this.el.setStyle('display', 'block');
        this.el.show();
        if(this.maximized){
            this.fitContainer();
        }

        if(this.monitorResize || this.modal || this.constrain || this.constrainHeader){
            Wtf.EventManager.onWindowResize(this.onWindowResize, this);
        }
        this.doConstrain();
        if(this.layout){
            this.doLayout();
        }
        if(this.keyMap){
            this.keyMap.enable();
        }
        this.toFront();
        this.updateHandles();
        this.fireEvent("show", this);
    },

        animShow : function(){
        this.proxy.show();
        this.proxy.setBox(this.animateTarget.getBox());
        this.proxy.setOpacity(0);
        var b = this.getBox(false);
        b.callback = this.afterShow;
        b.scope = this;
        b.duration = .25;
        b.easing = 'easeNone';
        b.opacity = .5;
        b.block = true;
        this.el.setStyle('display', 'none');
        this.proxy.shift(b);
    },

    
    hide : function(animateTarget, cb, scope){
        if(this.hidden || this.fireEvent("beforehide", this) === false){
            return;
        }
        if(cb){
            this.on('hide', cb, scope, {single:true});
        }
        this.hidden = true;
        if(animateTarget !== undefined){
            this.setAnimateTarget(animateTarget);
        }
        if(this.animateTarget){
            this.animHide();
        }else{
            this.el.hide();
            this.afterHide();
        }
    },

        afterHide : function(){
        this.proxy.hide();
        if(this.monitorResize || this.modal || this.constrain || this.constrainHeader){
            Wtf.EventManager.removeResizeListener(this.onWindowResize, this);
        }
        if(this.modal){
            this.mask.hide();
            Wtf.getBody().removeClass("x-body-masked");
        }
        if(this.keyMap){
            this.keyMap.disable();
        }
        this.fireEvent("hide", this);
    },

        animHide : function(){
        this.proxy.setOpacity(.5);
        this.proxy.show();
        var tb = this.getBox(false);
        this.proxy.setBox(tb);
        this.el.hide();
        var b = this.animateTarget.getBox();
        b.callback = this.afterHide;
        b.scope = this;
        b.duration = .25;
        b.easing = 'easeNone';
        b.block = true;
        b.opacity = 0;
        this.proxy.shift(b);
    },

        onWindowResize : function(){
        if(this.maximized){
            this.fitContainer();
        }
        if(this.modal){
            this.mask.setSize('100%', '100%');
            var force = this.mask.dom.offsetHeight;
            this.mask.setSize(Wtf.lib.Dom.getViewWidth(true), Wtf.lib.Dom.getViewHeight(true));
        }
        this.doConstrain();
    },

        doConstrain : function(){
        if(this.constrain || this.constrainHeader){
            var offsets;
            if(this.constrain){
                offsets = {
                    right:this.el.shadowOffset,
                    left:this.el.shadowOffset,
                    bottom:this.el.shadowOffset
                };
            }else {
                var s = this.getSize();
                offsets = {
                    right:-(s.width - 100),
                    bottom:-(s.height - 25)
                };
            }

            var xy = this.el.getConstrainToXY(this.container, true, offsets);
            if(xy){
                this.setPosition(xy[0], xy[1]);
            }
        }
    },

        ghost : function(cls){
        var ghost = this.createGhost(cls);
        var box = this.getBox(true);
        ghost.setLeftTop(box.x, box.y);
        ghost.setWidth(box.width);
        this.el.hide();
        this.activeGhost = ghost;
        return ghost;
    },

        unghost : function(show, matchPosition){
        if(show !== false){
            this.el.show();
            this.focus();
        }
        if(matchPosition !== false){
            this.setPosition(this.activeGhost.getLeft(true), this.activeGhost.getTop(true));
        }
        this.activeGhost.hide();
        this.activeGhost.remove();
        delete this.activeGhost;
    },

    
    minimize : function(){
        this.fireEvent('minimize', this);
    },

    
    close : function(){
        if(this.fireEvent("beforeclose", this) !== false){
            this.hide(null, function(){
                this.fireEvent('close', this);
                this.destroy();
            }, this);
        }
    },

    
    maximize : function(){
        if(!this.maximized){
            this.expand(false);
            this.restoreSize = this.getSize();
            this.restorePos = this.getPosition(true);
            this.tools.maximize.hide();
            this.tools.restore.show();
            this.maximized = true;
            this.el.disableShadow();

            if(this.dd){
                this.dd.lock();
            }
            if(this.collapsible){
                this.tools.toggle.hide();
            }
            this.el.addClass('x-window-maximized');
            this.container.addClass('x-window-maximized-ct');

            this.setPosition(0, 0);
            this.fitContainer();
            this.fireEvent('maximize', this);
        }
    },

    
    restore : function(){
        if(this.maximized){
            this.el.removeClass('x-window-maximized');
            this.tools.restore.hide();
            this.tools.maximize.show();
            this.setPosition(this.restorePos[0], this.restorePos[1]);
            this.setSize(this.restoreSize.width, this.restoreSize.height);
            delete this.restorePos;
            delete this.restoreSize;
            this.maximized = false;
            this.el.enableShadow(true);

            if(this.dd){
                this.dd.unlock();
            }
            if(this.collapsible){
                this.tools.toggle.show();
            }
            this.container.removeClass('x-window-maximized-ct');

            this.doConstrain();
            this.fireEvent('restore', this);
        }
    },

    
    toggleMaximize : function(){
        this[this.maximized ? 'restore' : 'maximize']();
    },

        fitContainer : function(){
        var vs = this.container.getViewSize();
        this.setSize(vs.width, vs.height);
    },

            setZIndex : function(index){
        if(this.modal){
            this.mask.setStyle("z-index", index);
        }
        this.el.setZIndex(++index);
        index += 5;

        if(this.resizer){
            this.resizer.proxy.setStyle("z-index", ++index);
        }

        this.lastZIndex = index;
    },

    
    alignTo : function(element, position, offsets){
        var xy = this.el.getAlignToXY(element, position, offsets);
        this.setPagePosition(xy[0], xy[1]);
        return this;
    },

    
    anchorTo : function(el, alignment, offsets, monitorScroll, _pname){
        var action = function(){
            this.alignTo(el, alignment, offsets);
        };
        Wtf.EventManager.onWindowResize(action, this);
        var tm = typeof monitorScroll;
        if(tm != 'undefined'){
            Wtf.EventManager.on(window, 'scroll', action, this,
                {buffer: tm == 'number' ? monitorScroll : 50});
        }
        action.call(this);
        this[_pname] = action;
        return this;
    },

    
    toFront : function(){
        if(this.manager.bringToFront(this)){
            this.focus();
        }
        return this;
    },

    
    setActive : function(active){
        if(active){
            if(!this.maximized){
                this.el.enableShadow(true);
            }
            this.fireEvent('activate', this);
        }else{
            this.el.disableShadow();
            this.fireEvent('deactivate', this);
        }
    },

    
    toBack : function(){
        this.manager.sendToBack(this);
        return this;
    },

    
    center : function(){
        var xy = this.el.getAlignToXY(this.container, 'c-c');
        this.setPagePosition(xy[0], xy[1]);
        return this;
    }
});
Wtf.reg('window', Wtf.Window);

Wtf.Window.DD = function(win){
    this.win = win;
    Wtf.Window.DD.superclass.constructor.call(this, win.el.id, 'WindowDD-'+win.id);
    this.setHandleElId(win.header.id);
    this.scroll = false;
};

Wtf.extend(Wtf.Window.DD, Wtf.dd.DD, {
    moveOnly:true,
    headerOffsets:[100, 25],
    startDrag : function(){
        var w = this.win;
        this.proxy = w.ghost();
        if(w.constrain !== false){
            var so = w.el.shadowOffset;
            this.constrainTo(w.container, {right: so, left: so, bottom: so});
        }else if(w.constrainHeader !== false){
            var s = this.proxy.getSize();
            this.constrainTo(w.container, {right: -(s.width-this.headerOffsets[0]), bottom: -(s.height-this.headerOffsets[1])});
        }
    },
    b4Drag : Wtf.emptyFn,

    onDrag : function(e){
        this.alignElWithMouse(this.proxy, e.getPageX(), e.getPageY());
    },

    endDrag : function(e){
        this.win.unghost();
        this.win.saveState();
    }
});

Wtf.WindowGroup = function(){
    var list = {};
    var accessList = [];
    var front = null;

        var sortWindows = function(d1, d2){
        return (!d1._lastAccess || d1._lastAccess < d2._lastAccess) ? -1 : 1;
    };

        var orderWindows = function(){
        var a = accessList, len = a.length;
        if(len > 0){
            a.sort(sortWindows);
            var seed = a[0].manager.zseed;
            for(var i = 0; i < len; i++){
                var win = a[i];
                if(win && !win.hidden){
                    win.setZIndex(seed + (i*10));
                }
            }
        }
        activateLast();
    };

        var setActiveWin = function(win){
        if(win != front){
            if(front){
                front.setActive(false);
            }
            front = win;
            if(win){
                win.setActive(true);
            }
        }
    };

        var activateLast = function(){
        for(var i = accessList.length-1; i >=0; --i) {
            if(!accessList[i].hidden){
                setActiveWin(accessList[i]);
                return;
            }
        }
                setActiveWin(null);
    };

    return {
        
        zseed : 9000,

                register : function(win){
            list[win.id] = win;
            accessList.push(win);
            win.on('hide', activateLast);
        },

                unregister : function(win){
            delete list[win.id];
            win.un('hide', activateLast);
            accessList.remove(win);
        },

        
        get : function(id){
            return typeof id == "object" ? id : list[id];
        },

        
        bringToFront : function(win){
            win = this.get(win);
            if(win != front){
                win._lastAccess = new Date().getTime();
                orderWindows();
                return true;
            }
            return false;
        },

        
        sendToBack : function(win){
            win = this.get(win);
            win._lastAccess = -(new Date().getTime());
            orderWindows();
            return win;
        },

        
        hideAll : function(){
            for(var id in list){
                if(list[id] && typeof list[id] != "function" && list[id].isVisible()){
                    list[id].hide();
                }
            }
        },

        
        getActive : function(){
            return front;
        },

        
        getBy : function(fn, scope){
            var r = [];
            for(var i = accessList.length-1; i >=0; --i) {
                var win = accessList[i];
                if(fn.call(scope||win, win) !== false){
                    r.push(win);
                }
            }
            return r;
        },

        
        each : function(fn, scope){
            for(var id in list){
                if(list[id] && typeof list[id] != "function"){
                    if(fn.call(scope || list[id], list[id]) === false){
                        return;
                    }
                }
            }
        }
    };
};



Wtf.WindowMgr = new Wtf.WindowGroup();

Wtf.dd.PanelProxy = function(panel, config){
    this.panel = panel;
    this.id = this.panel.id +'-ddproxy';
    Wtf.apply(this, config);
};

Wtf.dd.PanelProxy.prototype = {
    
    insertProxy : true,

    
    setStatus : Wtf.emptyFn,
    reset : Wtf.emptyFn,
    update : Wtf.emptyFn,
    stop : Wtf.emptyFn,
    sync: Wtf.emptyFn,

    
    getEl : function(){
        return this.ghost;
    },

    
    getGhost : function(){
        return this.ghost;
    },

    
    getProxy : function(){
        return this.proxy;
    },

    
    hide : function(){
        if(this.ghost){
            if(this.proxy){
                this.proxy.remove();
                delete this.proxy;
            }
            this.panel.el.dom.style.display = '';
            this.ghost.remove();
            delete this.ghost;
        }
    },

    
    show : function(){
        if(!this.ghost){
            this.ghost = this.panel.createGhost(undefined, undefined, Wtf.getBody());
            this.ghost.setXY(this.panel.el.getXY())
            if(this.insertProxy){
                this.proxy = this.panel.el.insertSibling({cls:'x-panel-dd-spacer'});
                this.proxy.setSize(this.panel.getSize());
            }
            this.panel.el.dom.style.display = 'none';
        }
    },

    
    repair : function(xy, callback, scope){
        this.hide();
        if(typeof callback == "function"){
            callback.call(scope || this);
        }
    },

    
    moveProxy : function(parentNode, before){
        if(this.proxy){
            parentNode.insertBefore(this.proxy.dom, before);
        }
    }
};


Wtf.Panel.DD = function(panel, cfg){
    this.panel = panel;
    this.dragData = {panel: panel};
    this.proxy = new Wtf.dd.PanelProxy(panel, cfg);
    Wtf.Panel.DD.superclass.constructor.call(this, panel.el, cfg);
    this.setHandleElId(panel.header.id);
    panel.header.setStyle('cursor', 'move');
    this.scroll = false;
};

Wtf.extend(Wtf.Panel.DD, Wtf.dd.DragSource, {
    showFrame: Wtf.emptyFn,
    startDrag: Wtf.emptyFn,
    b4StartDrag: function(x, y) {
        this.proxy.show();
    },
    b4MouseDown: function(e) {
        var x = e.getPageX();
        var y = e.getPageY();
        this.autoOffset(x, y);
    },
    onInitDrag : function(x, y){
        this.onStartDrag(x, y);
        return true;
    },
    createFrame : Wtf.emptyFn,
    getDragEl : function(e){
        return this.proxy.ghost.dom;
    },
    endDrag : function(e){
        this.proxy.hide();
        this.panel.saveState();
    },

    autoOffset : function(x, y) {
        x -= this.startPageX;
        y -= this.startPageY;
        this.setDelta(x, y);
    }
});

Wtf.state.Provider = function(){
    
    this.addEvents("statechange");
    this.state = {};
    Wtf.state.Provider.superclass.constructor.call(this);
};
Wtf.extend(Wtf.state.Provider, Wtf.util.Observable, {
    
    get : function(name, defaultValue){
        return typeof this.state[name] == "undefined" ?
            defaultValue : this.state[name];
    },
    
    
    clear : function(name){
        delete this.state[name];
        this.fireEvent("statechange", this, name, null);
    },
    
    
    set : function(name, value){
        this.state[name] = value;
        
        this.fireEvent("statechange", this, name, value);
    },
    
    
    decodeValue : function(cookie){
        var re = /^(a|n|d|b|s|o)\:(.*)$/;
        var matches = re.exec(unescape(cookie));
        if(!matches || !matches[1]) return; 
        var type = matches[1];
        var v = matches[2];
        switch(type){
            case "n":
                return parseFloat(v);
            case "d":
                return new Date(Date.parse(v));
            case "b":
                return (v == "1");
            case "a":
                var all = [];
                var values = v.split("^");
                for(var i = 0, len = values.length; i < len; i++){
                    all.push(this.decodeValue(values[i]));
                }
                return all;
           case "o":
                var all = {};
                var values = v.split("^");
                for(var i = 0, len = values.length; i < len; i++){
                    var kv = values[i].split("=");
                    all[kv[0]] = this.decodeValue(kv[1]);
                }
                return all;
           default:
                return v;
        }
    },
    
    
    encodeValue : function(v){
        var enc;
        if(typeof v == "number"){
            enc = "n:" + v;
        }else if(typeof v == "boolean"){
            enc = "b:" + (v ? "1" : "0");
        }else if(v instanceof Date){
            enc = "d:" + v.toGMTString();
        }else if(v instanceof Array){
            var flat = "";
            for(var i = 0, len = v.length; i < len; i++){
                flat += this.encodeValue(v[i]);
                if(i != len-1) flat += "^";
            }
            enc = "a:" + flat;
        }else if(typeof v == "object"){
            var flat = "";
            for(var key in v){
                if(typeof v[key] != "function" && v[key] !== undefined){
                    flat += key + "=" + this.encodeValue(v[key]) + "^";
                }
            }
            enc = "o:" + flat.substring(0, flat.length-1);
        }else{
            enc = "s:" + v;
        }
        return escape(enc);        
    }
});


Wtf.state.Manager = function(){
    var provider = new Wtf.state.Provider();

    return {
        
        setProvider : function(stateProvider){
            provider = stateProvider;
        },

        
        get : function(key, defaultValue){
            return provider.get(key, defaultValue);
        },

        
         set : function(key, value){
            provider.set(key, value);
        },

        
        clear : function(key){
            provider.clear(key);
        },

        
        getProvider : function(){
            return provider;
        }
    };
}();


Wtf.state.CookieProvider = function(config){
    Wtf.state.CookieProvider.superclass.constructor.call(this);
    this.path = "/";
    this.expires = new Date(new Date().getTime()+(1000*60*60*24*7)); 
    this.domain = null;
    this.secure = false;
    Wtf.apply(this, config);
    this.state = this.readCookies();
};

Wtf.extend(Wtf.state.CookieProvider, Wtf.state.Provider, {
    
    set : function(name, value){
        if(typeof value == "undefined" || value === null){
            this.clear(name);
            return;
        }
        this.setCookie(name, value);
        Wtf.state.CookieProvider.superclass.set.call(this, name, value);
    },

    
    clear : function(name){
        this.clearCookie(name);
        Wtf.state.CookieProvider.superclass.clear.call(this, name);
    },

    
    readCookies : function(){
        var cookies = {};
        var c = document.cookie + ";";
        var re = /\s?(.*?)=(.*?);/g;
    	var matches;
    	while((matches = re.exec(c)) != null){
            var name = matches[1];
            var value = matches[2];
            if(name && name.substring(0,3) == "ys-"){
                cookies[name.substr(3)] = this.decodeValue(value);
            }
        }
        return cookies;
    },

    
    setCookie : function(name, value){
        document.cookie = "ys-"+ name + "=" + this.encodeValue(value) +
           ((this.expires == null) ? "" : ("; expires=" + this.expires.toGMTString())) +
           ((this.path == null) ? "" : ("; path=" + this.path)) +
           ((this.domain == null) ? "" : ("; domain=" + this.domain)) +
           ((this.secure == true) ? "; secure" : "");
    },

    
    clearCookie : function(name){
        document.cookie = "ys-" + name + "=null; expires=Thu, 01-Jan-70 00:00:01 GMT" +
           ((this.path == null) ? "" : ("; path=" + this.path)) +
           ((this.domain == null) ? "" : ("; domain=" + this.domain)) +
           ((this.secure == true) ? "; secure" : "");
    }
});

Wtf.DataView = Wtf.extend(Wtf.BoxComponent, {
    
    
    
    
    
    
    
    
    
    selectedClass : "x-view-selected",
    
    emptyText : "",

    
    last: false,

    
    initComponent : function(){
        Wtf.DataView.superclass.initComponent.call(this);
        if(typeof this.tpl == "string"){
            this.tpl = new Wtf.XTemplate(this.tpl);
        }

        this.addEvents(
            
            "beforeclick",
            
            "click",
            
            "containerclick",
            
            "dblclick",
            
            "contextmenu",
            
            "selectionchange",

            
            "beforeselect"
        );

        this.all = new Wtf.CompositeElementLite();
        this.selected = new Wtf.CompositeElementLite();
    },

    
    onRender : function(){
        if(!this.el){
            this.el = document.createElement('div');
        }
        Wtf.DataView.superclass.onRender.apply(this, arguments);
    },

    
    afterRender : function(){
        Wtf.DataView.superclass.afterRender.call(this);

        this.el.on({
            "click": this.onClick,
            "dblclick": this.onDblClick,
            "contextmenu": this.onContextMenu,
            scope:this
        });

        if(this.overClass){
            this.el.on({
                "mouseover": this.onMouseOver,
                "mouseout": this.onMouseOut,
                scope:this
            });
        }

        if(this.store){
            this.setStore(this.store, true);
        }
    },

    
    refresh : function(){
        this.clearSelections(false, true);
        this.el.update("");
        var html = [];
        var records = this.store.getRange();
        if(records.length < 1){
            this.el.update(this.emptyText);
            this.all.clear();
            return;
        }
        this.tpl.overwrite(this.el, this.collectData(records, 0));
        this.all.fill(Wtf.query(this.itemSelector, this.el.dom));
        this.updateIndexes(0);
    },

    
    prepareData : function(data){
        return data;
    },

    
    collectData : function(records, startIndex){
        var r = [];
        for(var i = 0, len = records.length; i < len; i++){
            r[r.length] = this.prepareData(records[i].data, startIndex+i, records[i]);
        }
        return r;
    },

    
    bufferRender : function(records){
        var div = document.createElement('div');
        this.tpl.overwrite(div, this.collectData(records));
        return Wtf.query(this.itemSelector, div);
    },

    
    onUpdate : function(ds, record){
        var index = this.store.indexOf(record);
        var sel = this.isSelected(index);
        var original = this.all.elements[index];
        var node = this.bufferRender([record], index)[0];

        this.all.replaceElement(index, node, true);
        if(sel){
            this.selected.replaceElement(original, node);
            this.all.item(index).addClass(this.selectedClass);
        }
        this.updateIndexes(index, index);
    },

    
    onAdd : function(ds, records, index){
        if(this.all.getCount() == 0){
            this.refresh();
            return;
        }
        var nodes = this.bufferRender(records, index), n;
        if(index < this.all.getCount()){
            n = this.all.item(index).insertSibling(nodes, 'before', true);
            this.all.elements.splice(index, 0, n);
        }else{
            n = this.all.last().insertSibling(nodes, 'after', true);
            this.all.elements.push(n);
        }
        this.updateIndexes(index);
    },

    
    onRemove : function(ds, record, index){
        this.deselect(index);
        this.all.removeElement(index, true);
        this.updateIndexes(index);
    },

    
    refreshNode : function(index){
        this.onUpdate(this.store, this.store.getAt(index));
    },

    
    updateIndexes : function(startIndex, endIndex){
        var ns = this.all.elements;
        startIndex = startIndex || 0;
        endIndex = endIndex || ((endIndex === 0) ? 0 : (ns.length - 1));
        for(var i = startIndex; i <= endIndex; i++){
            ns[i].viewIndex = i;
        }
    },

    
    setStore : function(store, initial){
        if(!initial && this.store){
            this.store.un("beforeload", this.onBeforeLoad, this);
            this.store.un("datachanged", this.refresh, this);
            this.store.un("add", this.onAdd, this);
            this.store.un("remove", this.onRemove, this);
            this.store.un("update", this.onUpdate, this);
            this.store.un("clear", this.refresh, this);
        }
        if(store){
            store = Wtf.StoreMgr.lookup(store);
            store.on("beforeload", this.onBeforeLoad, this);
            store.on("datachanged", this.refresh, this);
            store.on("add", this.onAdd, this);
            store.on("remove", this.onRemove, this);
            store.on("update", this.onUpdate, this);
            store.on("clear", this.refresh, this);
        }
        this.store = store;
        if(store){
            this.refresh();
        }
    },

    
    findItemFromChild : function(node){
        return Wtf.fly(node).findParent(this.itemSelector, this.el);
    },

    
    onClick : function(e){
        var item = e.getTarget(this.itemSelector, this.el);
        if(item){
            var index = this.indexOf(item);
            if(this.onItemClick(item, index, e) !== false){
                this.fireEvent("click", this, index, item, e);
            }
        }else{
            if(this.fireEvent("containerclick", this, e) !== false){
                this.clearSelections();
            }
        }
    },

    
    onContextMenu : function(e){
        var item = e.getTarget(this.itemSelector, this.el);
        if(item){
            this.fireEvent("contextmenu", this, this.indexOf(item), item, e);
        }
    },

    
    onDblClick : function(e){
        var item = e.getTarget(this.itemSelector, this.el);
        if(item){
            this.fireEvent("dblclick", this, this.indexOf(item), item, e);
        }
    },

    
    onMouseOver : function(e){
        var item = e.getTarget(this.itemSelector, this.el);
        if(item && item !== this.lastItem){
            this.lastItem = item;
            Wtf.fly(item).addClass(this.overClass);
        }
    },

    
    onMouseOut : function(e){
        if(this.lastItem){
            if(!e.within(this.lastItem, true)){
                Wtf.fly(this.lastItem).removeClass(this.overClass);
                delete this.lastItem;
            }
        }
    },

    
    onItemClick : function(item, index, e){
        if(this.fireEvent("beforeclick", this, index, item, e) === false){
            return false;
        }
        if(this.multiSelect){
            this.doMultiSelection(item, index, e);
            e.preventDefault();
        }else if(this.singleSelect){
            this.doSingleSelection(item, index, e);
            e.preventDefault();
        }
        return true;
    },

    
    doSingleSelection : function(item, index, e){
        if(e.ctrlKey && this.isSelected(index)){
            this.deselect(index);
        }else{
            this.select(index, false);
        }
    },

    
    doMultiSelection : function(item, index, e){
        if(e.shiftKey && this.last !== false){
            var last = this.last;
            this.selectRange(last, index, e.ctrlKey);
            this.last = last; 
        }else{
            if((e.ctrlKey||this.simpleSelect) && this.isSelected(index)){
                this.deselect(index);
            }else{
                this.select(index, e.ctrlKey || e.shiftKey || this.simpleSelect);
            }
        }
    },

    
    getSelectionCount : function(){
        return this.selected.getCount()
    },

    
    getSelectedNodes : function(){
        return this.selected.elements;
    },

    
    getSelectedIndexes : function(){
        var indexes = [], s = this.selected.elements;
        for(var i = 0, len = s.length; i < len; i++){
            indexes.push(s[i].viewIndex);
        }
        return indexes;
    },

    
    getSelectedRecords : function(){
        var r = [], s = this.selected.elements;
        for(var i = 0, len = s.length; i < len; i++){
            r[r.length] = this.store.getAt(s[i].viewIndex);
        }
        return r;
    },

    
    getRecords : function(nodes){
        var r = [], s = nodes;
        for(var i = 0, len = s.length; i < len; i++){
            r[r.length] = this.store.getAt(s[i].viewIndex);
        }
        return r;
    },

    
    getRecord : function(node){
        return this.store.getAt(node.viewIndex);
    },

    
    clearSelections : function(suppressEvent, skipUpdate){
        if(this.multiSelect || this.singleSelect){
            if(!skipUpdate){
                this.selected.removeClass(this.selectedClass);
            }
            this.selected.clear();
            this.last = false;
            if(!suppressEvent){
                this.fireEvent("selectionchange", this, this.selected.elements);
            }
        }
    },

    
    isSelected : function(node){
        return this.selected.contains(this.getNode(node));
    },

    
    deselect : function(node){
        if(this.isSelected(node)){
            var node = this.getNode(node);
            this.selected.removeElement(node);
            if(this.last == node.viewIndex){
                this.last = false;
            }
            Wtf.fly(node).removeClass(this.selectedClass);
            this.fireEvent("selectionchange", this, this.selected.elements);
        }
    },

    
    select : function(nodeInfo, keepExisting, suppressEvent){
        if(nodeInfo instanceof Array){
            if(!keepExisting){
                this.clearSelections(true);
            }
            for(var i = 0, len = nodeInfo.length; i < len; i++){
                this.select(nodeInfo[i], true, true);
            }
        } else{
            var node = this.getNode(nodeInfo);
            if(!keepExisting){
                this.clearSelections(true);
            }
            if(node && !this.isSelected(node)){
                if(this.fireEvent("beforeselect", this, node, this.selected.elements) !== false){
                    Wtf.fly(node).addClass(this.selectedClass);
                    this.selected.add(node);
                    this.last = node.viewIndex;
                    if(!suppressEvent){
                        this.fireEvent("selectionchange", this, this.selected.elements);
                    }
                }
            }
        }
    },

    
    selectRange : function(start, end, keepExisting){
        if(!keepExisting){
            this.clearSelections(true);
        }
        this.select(this.getNodes(start, end), true);
    },

    
    getNode : function(nodeInfo){
        if(typeof nodeInfo == "string"){
            return document.getElementById(nodeInfo);
        }else if(typeof nodeInfo == "number"){
            return this.all.elements[nodeInfo];
        }
        return nodeInfo;
    },

    
    getNodes : function(start, end){
        var ns = this.all.elements;
        start = start || 0;
        end = typeof end == "undefined" ? ns.length - 1 : end;
        var nodes = [], i;
        if(start <= end){
            for(i = start; i <= end; i++){
                nodes.push(ns[i]);
            }
        } else{
            for(i = start; i >= end; i--){
                nodes.push(ns[i]);
            }
        }
        return nodes;
    },

    
    indexOf : function(node){
        node = this.getNode(node);
        if(typeof node.viewIndex == "number"){
            return node.viewIndex;
        }
        return this.all.indexOf(node);
    },

    
    onBeforeLoad : function(){
        if(this.loadingText){
            this.clearSelections(false, true);
            this.el.update('<div class="loading-indicator">'+this.loadingText+'</div>');
            this.all.clear();
        }
    }
});

Wtf.reg('dataview', Wtf.DataView);

Wtf.ColorPalette = function(config){
    Wtf.ColorPalette.superclass.constructor.call(this, config);
    this.addEvents(
        
        'select'
    );

    if(this.handler){
        this.on("select", this.handler, this.scope, true);
    }
};
Wtf.extend(Wtf.ColorPalette, Wtf.Component, {
    
    itemCls : "x-color-palette",
    
    value : null,
    clickEvent:'click',
        ctype: "Wtf.ColorPalette",

    
    allowReselect : false,

    
    colors : [
        "000000", "993300", "333300", "003300", "003366", "000080", "333399", "333333",
        "800000", "FF6600", "808000", "008000", "008080", "0000FF", "666699", "808080",
        "FF0000", "FF9900", "99CC00", "339966", "33CCCC", "3366FF", "800080", "969696",
        "FF00FF", "FFCC00", "FFFF00", "00FF00", "00FFFF", "00CCFF", "993366", "C0C0C0",
        "FF99CC", "FFCC99", "FFFF99", "CCFFCC", "CCFFFF", "99CCFF", "CC99FF", "FFFFFF"
    ],

        onRender : function(container, position){
        var t = new Wtf.XTemplate(
            '<tpl for="."><a href="#" class="color-{.}" hidefocus="on"><em><span style="background:#{.}" unselectable="on">&#160;</span></em></a></tpl>'
        );
        var el = document.createElement("div");
        el.className = this.itemCls;
        t.overwrite(el, this.colors);
        container.dom.insertBefore(el, position);
        this.el = Wtf.get(el);
        this.el.on(this.clickEvent, this.handleClick,  this, {delegate: "a"});
        if(this.clickEvent != 'click'){
            this.el.on('click', Wtf.emptyFn,  this, {delegate: "a", preventDefault:true});
        }
    },

        afterRender : function(){
        Wtf.ColorPalette.superclass.afterRender.call(this);
        if(this.value){
            var s = this.value;
            this.value = null;
            this.select(s);
        }
    },

        handleClick : function(e, t){
        e.preventDefault();
        if(!this.disabled){
            var c = t.className.match(/(?:^|\s)color-(.{6})(?:\s|$)/)[1];
            this.select(c.toUpperCase());
        }
    },

    
    select : function(color){
        color = color.replace("#", "");
        if(color != this.value || this.allowReselect){
            var el = this.el;
            if(this.value){
                el.child("a.color-"+this.value).removeClass("x-color-palette-sel");
            }
            el.child("a.color-"+color).addClass("x-color-palette-sel");
            this.value = color;
            this.fireEvent("select", this, color);
        }
    }
});
Wtf.reg('colorpalette', Wtf.ColorPalette);

Wtf.DatePicker = Wtf.extend(Wtf.Component, {
    
    todayText : "Today",
    
    okText : "&#160;OK&#160;", 
    
    cancelText : "Cancel",
    
    todayTip : "{0} (Spacebar)",
    
    minDate : null,
    
    maxDate : null,
    
    minText : "This date is before the minimum date",
    
    maxText : "This date is after the maximum date",
    
    format : "m/d/y",
    
    disabledDays : null,
    
    disabledDaysText : "",
    
    disabledDatesRE : null,
    
    disabledDatesText : "",
    
    constrainToViewport : true,
    
    monthNames : Date.monthNames,
    
    dayNames : Date.dayNames,
    
    nextText: 'Next Month (Control+Right)',
    
    prevText: 'Previous Month (Control+Left)',
    
    monthYearText: 'Choose a month (Control+Up/Down to move years)',
    
    startDay : 0,

    initComponent : function(){
        Wtf.DatePicker.superclass.initComponent.call(this);

        this.value = this.value ?
                 this.value.clearTime() : new Date().clearTime();

        this.addEvents(
            
            'select'
        );

        if(this.handler){
            this.on("select", this.handler,  this.scope || this);
        }

        this.initDisabledDays();
    },

    
    initDisabledDays : function(){
        if(!this.disabledDatesRE && this.disabledDates){
            var dd = this.disabledDates;
            var re = "(?:";
            for(var i = 0; i < dd.length; i++){
                re += dd[i];
                if(i != dd.length-1) re += "|";
            }
            this.disabledDatesRE = new RegExp(re + ")");
        }
    },

    
    setValue : function(value){
        var old = this.value;
        this.value = value.clearTime(true);
        if(this.el){
            this.update(this.value);
        }
    },

    
    getValue : function(){
        return this.value;
    },

    
    focus : function(){
        if(this.el){
            this.update(this.activeDate);
        }
    },

    
    onRender : function(container, position){
        var m = [
             '<table cellspacing="0">',
                '<tr><td class="x-date-left"><a href="#" title="', this.prevText ,'">&#160;</a></td><td class="x-date-middle" align="center"></td><td class="x-date-right"><a href="#" title="', this.nextText ,'">&#160;</a></td></tr>',
                '<tr><td colspan="3"><table class="x-date-inner" cellspacing="0"><thead><tr>'];
        var dn = this.dayNames;
        for(var i = 0; i < 7; i++){
            var d = this.startDay+i;
            if(d > 6){
                d = d-7;
            }
            m.push("<th><span>", dn[d].substr(0,1), "</span></th>");
        }
        m[m.length] = "</tr></thead><tbody><tr>";
        for(var i = 0; i < 42; i++) {
            if(i % 7 == 0 && i != 0){
                m[m.length] = "</tr><tr>";
            }
            m[m.length] = '<td><a href="#" hidefocus="on" class="x-date-date" tabIndex="1"><em><span></span></em></a></td>';
        }
        m[m.length] = '</tr></tbody></table></td></tr><tr><td colspan="3" class="x-date-bottom" align="center"></td></tr></table><div class="x-date-mp"></div>';

        var el = document.createElement("div");
        el.className = "x-date-picker";
        el.innerHTML = m.join("");

        container.dom.insertBefore(el, position);

        this.el = Wtf.get(el);
        this.eventEl = Wtf.get(el.firstChild);

        new Wtf.util.ClickRepeater(this.el.child("td.x-date-left a"), {
            handler: this.showPrevMonth,
            scope: this,
            preventDefault:true,
            stopDefault:true
        });

        new Wtf.util.ClickRepeater(this.el.child("td.x-date-right a"), {
            handler: this.showNextMonth,
            scope: this,
            preventDefault:true,
            stopDefault:true
        });

        this.eventEl.on("mousewheel", this.handleMouseWheel,  this);

        this.monthPicker = this.el.down('div.x-date-mp');
        this.monthPicker.enableDisplayMode('block');
        
        var kn = new Wtf.KeyNav(this.eventEl, {
            "left" : function(e){
                e.ctrlKey ?
                    this.showPrevMonth() :
                    this.update(this.activeDate.add("d", -1));
            },

            "right" : function(e){
                e.ctrlKey ?
                    this.showNextMonth() :
                    this.update(this.activeDate.add("d", 1));
            },

            "up" : function(e){
                e.ctrlKey ?
                    this.showNextYear() :
                    this.update(this.activeDate.add("d", -7));
            },

            "down" : function(e){
                e.ctrlKey ?
                    this.showPrevYear() :
                    this.update(this.activeDate.add("d", 7));
            },

            "pageUp" : function(e){
                this.showNextMonth();
            },

            "pageDown" : function(e){
                this.showPrevMonth();
            },

            "enter" : function(e){
                e.stopPropagation();
                return true;
            },

            scope : this
        });

        this.eventEl.on("click", this.handleDateClick,  this, {delegate: "a.x-date-date"});

        this.eventEl.addKeyListener(Wtf.EventObject.SPACE, this.selectToday,  this);

        this.el.unselectable();
        
        this.cells = this.el.select("table.x-date-inner tbody td");
        this.textNodes = this.el.query("table.x-date-inner tbody span");

        this.mbtn = new Wtf.Button({
            text: "&#160;",
            tooltip: this.monthYearText,
            renderTo: this.el.child("td.x-date-middle", true)
        });

        this.mbtn.on('click', this.showMonthPicker, this);
        this.mbtn.el.child(this.mbtn.menuClassTarget).addClass("x-btn-with-menu");


        var today = (new Date()).dateFormat(this.format);
        var todayBtn = new Wtf.Button({
            renderTo: this.el.child("td.x-date-bottom", true),
            text: String.format(this.todayText, today),
            tooltip: String.format(this.todayTip, today),
            handler: this.selectToday,
            scope: this
        });
        
        if(Wtf.isIE){
            this.el.repaint();
        }
        this.update(this.value);
    },

    createMonthPicker : function(){
        if(!this.monthPicker.dom.firstChild){
            var buf = ['<table border="0" cellspacing="0">'];
            for(var i = 0; i < 6; i++){
                buf.push(
                    '<tr><td class="x-date-mp-month"><a href="#">', this.monthNames[i].substr(0, 3), '</a></td>',
                    '<td class="x-date-mp-month x-date-mp-sep"><a href="#">', this.monthNames[i+6].substr(0, 3), '</a></td>',
                    i == 0 ?
                    '<td class="x-date-mp-ybtn" align="center"><a class="x-date-mp-prev"></a></td><td class="x-date-mp-ybtn" align="center"><a class="x-date-mp-next"></a></td></tr>' :
                    '<td class="x-date-mp-year"><a href="#"></a></td><td class="x-date-mp-year"><a href="#"></a></td></tr>'
                );
            }
            buf.push(
                '<tr class="x-date-mp-btns"><td colspan="4"><button type="button" class="x-date-mp-ok">',
                    this.okText,
                    '</button><button type="button" class="x-date-mp-cancel">',
                    this.cancelText,
                    '</button></td></tr>',
                '</table>'
            );
            this.monthPicker.update(buf.join(''));
            this.monthPicker.on('click', this.onMonthClick, this);
            this.monthPicker.on('dblclick', this.onMonthDblClick, this);

            this.mpMonths = this.monthPicker.select('td.x-date-mp-month');
            this.mpYears = this.monthPicker.select('td.x-date-mp-year');

            this.mpMonths.each(function(m, a, i){
                i += 1;
                if((i%2) == 0){
                    m.dom.xmonth = 5 + Math.round(i * .5);
                }else{
                    m.dom.xmonth = Math.round((i-1) * .5);
                }
            });
        }
    },

    showMonthPicker : function(){
        this.createMonthPicker();
        var size = this.el.getSize();
        this.monthPicker.setSize(size);
        this.monthPicker.child('table').setSize(size);

        this.mpSelMonth = (this.activeDate || this.value).getMonth();
        this.updateMPMonth(this.mpSelMonth);
        this.mpSelYear = (this.activeDate || this.value).getFullYear();
        this.updateMPYear(this.mpSelYear);

        this.monthPicker.slideIn('t', {duration:.2});
    },

    updateMPYear : function(y){
        this.mpyear = y;
        var ys = this.mpYears.elements;
        for(var i = 1; i <= 10; i++){
            var td = ys[i-1], y2;
            if((i%2) == 0){
                y2 = y + Math.round(i * .5);
                td.firstChild.innerHTML = y2;
                td.xyear = y2;
            }else{
                y2 = y - (5-Math.round(i * .5));
                td.firstChild.innerHTML = y2;
                td.xyear = y2;
            }
            this.mpYears.item(i-1)[y2 == this.mpSelYear ? 'addClass' : 'removeClass']('x-date-mp-sel');
        }
    },

    updateMPMonth : function(sm){
        this.mpMonths.each(function(m, a, i){
            m[m.dom.xmonth == sm ? 'addClass' : 'removeClass']('x-date-mp-sel');
        });
    },

    selectMPMonth: function(m){
        
    },

    onMonthClick : function(e, t){
        e.stopEvent();
        var el = new Wtf.Element(t), pn;
        if(el.is('button.x-date-mp-cancel')){
            this.hideMonthPicker();
        }
        else if(el.is('button.x-date-mp-ok')){
            this.update(new Date(this.mpSelYear, this.mpSelMonth, (this.activeDate || this.value).getDate()));
            this.hideMonthPicker();
        }
        else if(pn = el.up('td.x-date-mp-month', 2)){
            this.mpMonths.removeClass('x-date-mp-sel');
            pn.addClass('x-date-mp-sel');
            this.mpSelMonth = pn.dom.xmonth;
        }
        else if(pn = el.up('td.x-date-mp-year', 2)){
            this.mpYears.removeClass('x-date-mp-sel');
            pn.addClass('x-date-mp-sel');
            this.mpSelYear = pn.dom.xyear;
        }
        else if(el.is('a.x-date-mp-prev')){
            this.updateMPYear(this.mpyear-10);
        }
        else if(el.is('a.x-date-mp-next')){
            this.updateMPYear(this.mpyear+10);
        }
    },

    onMonthDblClick : function(e, t){
        e.stopEvent();
        var el = new Wtf.Element(t), pn;
        if(pn = el.up('td.x-date-mp-month', 2)){
            this.update(new Date(this.mpSelYear, pn.dom.xmonth, (this.activeDate || this.value).getDate()));
            this.hideMonthPicker();
        }
        else if(pn = el.up('td.x-date-mp-year', 2)){
            this.update(new Date(pn.dom.xyear, this.mpSelMonth, (this.activeDate || this.value).getDate()));
            this.hideMonthPicker();
        }
    },

    hideMonthPicker : function(disableAnim){
        if(this.monthPicker){
            if(disableAnim === true){
                this.monthPicker.hide();
            }else{
                this.monthPicker.slideOut('t', {duration:.2});
            }
        }
    },

    
    showPrevMonth : function(e){
        this.update(this.activeDate.add("mo", -1));
    },

    
    showNextMonth : function(e){
        this.update(this.activeDate.add("mo", 1));
    },

    
    showPrevYear : function(){
        this.update(this.activeDate.add("y", -1));
    },

    
    showNextYear : function(){
        this.update(this.activeDate.add("y", 1));
    },

    
    handleMouseWheel : function(e){
        var delta = e.getWheelDelta();
        if(delta > 0){
            this.showPrevMonth();
            e.stopEvent();
        } else if(delta < 0){
            this.showNextMonth();
            e.stopEvent();
        }
    },

    
    handleDateClick : function(e, t){
        e.stopEvent();
        if(t.dateValue && !Wtf.fly(t.parentNode).hasClass("x-date-disabled")){
            this.setValue(new Date(t.dateValue));
            this.fireEvent("select", this, this.value);
        }
    },

    
    selectToday : function(){
        this.setValue(new Date().clearTime());
        this.fireEvent("select", this, this.value);
    },

    
    update : function(date){
        var vd = this.activeDate;
        this.activeDate = date;
        if(vd && this.el){
            var t = date.getTime();
            if(vd.getMonth() == date.getMonth() && vd.getFullYear() == date.getFullYear()){
                this.cells.removeClass("x-date-selected");
                this.cells.each(function(c){
                   if(c.dom.firstChild.dateValue == t){
                       c.addClass("x-date-selected");
                       setTimeout(function(){
                            try{c.dom.firstChild.focus();}catch(e){}
                       }, 50);
                       return false;
                   }
                });
                return;
            }
        }
        var days = date.getDaysInMonth();
        var firstOfMonth = date.getFirstDateOfMonth();
        var startingPos = firstOfMonth.getDay()-this.startDay;

        if(startingPos <= this.startDay){
            startingPos += 7;
        }

        var pm = date.add("mo", -1);
        var prevStart = pm.getDaysInMonth()-startingPos;

        var cells = this.cells.elements;
        var textEls = this.textNodes;
        days += startingPos;

        
        var day = 86400000;
        var d = (new Date(pm.getFullYear(), pm.getMonth(), prevStart)).clearTime();
        var today = new Date().clearTime().getTime();
        var sel = date.clearTime().getTime();
        var min = this.minDate ? this.minDate.clearTime() : Number.NEGATIVE_INFINITY;
        var max = this.maxDate ? this.maxDate.clearTime() : Number.POSITIVE_INFINITY;
        var ddMatch = this.disabledDatesRE;
        var ddText = this.disabledDatesText;
        var ddays = this.disabledDays ? this.disabledDays.join("") : false;
        var ddaysText = this.disabledDaysText;
        var format = this.format;

        var setCellClass = function(cal, cell){
            cell.title = "";
            var t = d.getTime();
            cell.firstChild.dateValue = t;
            if(t == today){
                cell.className += " x-date-today";
                cell.title = cal.todayText;
            }
            if(t == sel){
                cell.className += " x-date-selected";
                setTimeout(function(){
                    try{cell.firstChild.focus();}catch(e){}
                }, 50);
            }
            
            if(t < min) {
                cell.className = " x-date-disabled";
                cell.title = cal.minText;
                return;
            }
            if(t > max) {
                cell.className = " x-date-disabled";
                cell.title = cal.maxText;
                return;
            }
            if(ddays){
                if(ddays.indexOf(d.getDay()) != -1){
                    cell.title = ddaysText;
                    cell.className = " x-date-disabled";
                }
            }
            if(ddMatch && format){
                var fvalue = d.dateFormat(format);
                if(ddMatch.test(fvalue)){
                    cell.title = ddText.replace("%0", fvalue);
                    cell.className = " x-date-disabled";
                }
            }
        };

        var i = 0;
        for(; i < startingPos; i++) {
            textEls[i].innerHTML = (++prevStart);
            d.setDate(d.getDate()+1);
            cells[i].className = "x-date-prevday";
            setCellClass(this, cells[i]);
        }
        for(; i < days; i++){
            intDay = i - startingPos + 1;
            textEls[i].innerHTML = (intDay);
            d.setDate(d.getDate()+1);
            cells[i].className = "x-date-active";
            setCellClass(this, cells[i]);
        }
        var extraDays = 0;
        for(; i < 42; i++) {
             textEls[i].innerHTML = (++extraDays);
             d.setDate(d.getDate()+1);
             cells[i].className = "x-date-nextday";
             setCellClass(this, cells[i]);
        }

        this.mbtn.setText(this.monthNames[date.getMonth()] + " " + date.getFullYear());

        if(!this.internalRender){
            var main = this.el.dom.firstChild;
            var w = main.offsetWidth;
            this.el.setWidth(w + this.el.getBorderWidth("lr"));
            Wtf.fly(main).setWidth(w);
            this.internalRender = true;
            
            
            
            if(Wtf.isOpera && !this.secondPass){
                main.rows[0].cells[1].style.width = (w - (main.rows[0].cells[0].offsetWidth+main.rows[0].cells[2].offsetWidth)) + "px";
                this.secondPass = true;
                this.update.defer(10, this, [date]);
            }
        }
    }
});
Wtf.reg('datepicker', Wtf.DatePicker);

Wtf.TabPanel = Wtf.extend(Wtf.Panel,  {
    
    
    monitorResize : true,
    
    deferredRender : true,
    
    tabWidth: 120,
    
    minTabWidth: 30,
    
    resizeTabs:false,
    
    enableTabScroll: false,
    
    scrollIncrement : 0,
    
    scrollRepeatInterval : 400,
    
    scrollDuration : .35,
    
    animScroll : true,
    
    tabPosition: 'top',
    
    baseCls: 'x-tab-panel',
    
    autoTabs : false,
    
    autoTabSelector:'div.x-tab',
        itemCls : 'x-tab-item',
    
    activeTab : null,
    
    tabMargin : 2,
    
    plain: false,

    
    wheelIncrement : 20,

        elements: 'body',
    headerAsText: false,
    frame: false,
    hideBorders:true,

        initComponent : function(){
        this.frame = false;
        Wtf.TabPanel.superclass.initComponent.call(this);
        this.addEvents(
            
            'beforetabchange',
            
            'tabchange',
            
            'contextmenu'
        );
        this.setLayout(new Wtf.layout.CardLayout({
            deferredRender: this.deferredRender
        }));
        if(this.tabPosition == 'top'){
            this.elements += ',header';
            this.stripTarget = 'header';
        }else {
            this.elements += ',footer';
            this.stripTarget = 'footer';
        }
        if(!this.stack){
            this.stack = Wtf.TabPanel.AccessStack();
        }
        this.initItems();
    },

        render : function(){
        Wtf.TabPanel.superclass.render.apply(this, arguments);
        if(this.activeTab !== undefined){
            var item = this.activeTab;
            delete this.activeTab;
            this.setActiveTab(item);
        }
    },

        onRender : function(ct, position){
        Wtf.TabPanel.superclass.onRender.call(this, ct, position);

        if(this.plain){
            var pos = this.tabPosition == 'top' ? 'header' : 'footer';
            this[pos].addClass('x-tab-panel-'+pos+'-plain');
        }

        var st = this[this.stripTarget];
        
        this.stripWrap = st.createChild({cls:'x-tab-strip-wrap', cn:{
            tag:'ul', cls:'x-tab-strip x-tab-strip-'+this.tabPosition}});
        this.stripSpacer = st.createChild({cls:'x-tab-strip-spacer'});
        this.strip = new Wtf.Element(this.stripWrap.dom.firstChild);
        
        this.edge = this.strip.createChild({tag:'li', cls:'x-tab-edge'});
        this.strip.createChild({cls:'x-clear'});

        this.body.addClass('x-tab-panel-body-'+this.tabPosition);
        
        if(!this.itemTpl){
            var tt = new Wtf.Template(
                 '<li class="{cls}" id="{id}"><a class="x-tab-strip-close" onclick="return false;"></a>',
                 '<a class="x-tab-right" href="#" onclick="return false;"><em class="x-tab-left">',
                 '<span class="x-tab-strip-inner"><span class="x-tab-strip-text {iconCls}">{text}</span></span>',
                 '</em></a></li>'
            );
            tt.disableFormats = true;
            tt.compile();
            Wtf.TabPanel.prototype.itemTpl = tt;
        }

        this.items.each(this.initTab, this);
    },

        afterRender : function(){
        Wtf.TabPanel.superclass.afterRender.call(this);
        if(this.autoTabs){
            this.readTabs(false);
        }
    },

        initEvents : function(){
        Wtf.TabPanel.superclass.initEvents.call(this);
        this.on('add', this.onAdd, this);
        this.on('remove', this.onRemove, this);

        this.strip.on('mousedown', this.onStripMouseDown, this);
        this.strip.on('click', this.onStripClick, this);
        this.strip.on('contextmenu', this.onStripContextMenu, this);
        if(this.enableTabScroll){
            this.strip.on('mousewheel', this.onWheel, this);
        }
    },

        findTargets : function(e){
        var item = null;
        var itemEl = e.getTarget('li', this.strip);
        if(itemEl){
            item = this.getComponent(itemEl.id.split('__')[1]);
            if(item.disabled){
                return {
                    close : null,
                    item : null,
                    el : null
                };
            }
        }
        return {
            close : e.getTarget('.x-tab-strip-close', this.strip),
            item : item,
            el : itemEl
        };
    },

        onStripMouseDown : function(e){
        e.preventDefault();
        if(e.button != 0){
            return;
        }
        var t = this.findTargets(e);
        if(t.close){
            this.remove(t.item);
            return;
        }
        if(t.item && t.item != this.activeTab){
            this.setActiveTab(t.item);
        }
    },

        onStripClick : function(e){
        var t = this.findTargets(e);
        if(!t.close && t.item && t.item != this.activeTab){
            this.setActiveTab(t.item);
        }
    },

        onStripContextMenu : function(e){
        e.preventDefault();
        var t = this.findTargets(e);
        if(t.item){
            this.fireEvent('contextmenu', this, t.item, e);
        }
    },

    
    readTabs : function(removeExisting){
        if(removeExisting === true){
            this.items.each(function(item){
                this.remove(item);
            }, this);
        }
        var tabs = this.el.query(this.autoTabSelector);
        for(var i = 0, len = tabs.length; i < len; i++){
            var tab = tabs[i];
            var title = tab.getAttribute('title');
            tab.removeAttribute('title');
            this.add({
                title: title,
                el: tab
            });
        }
    },

        initTab : function(item, index){
        var before = this.strip.dom.childNodes[index];
        var cls = item.closable ? 'x-tab-strip-closable' : '';
        if(item.disabled){
            cls += ' x-item-disabled';
        }
        if(item.iconCls){
            cls += ' x-tab-with-icon';
        }
        var p = {
            id: this.id + '__' + item.getItemId(),
            text: item.title,
            cls: cls,
            iconCls: item.iconCls || ''
        };
        var el = before ?
                 this.itemTpl.insertBefore(before, p) :
                 this.itemTpl.append(this.strip, p);

        Wtf.fly(el).addClassOnOver('x-tab-strip-over');

        if(item.tabTip){
            Wtf.fly(el).child('span.x-tab-strip-text', true).qtip = item.tabTip;
        }
        item.on('disable', this.onItemDisabled, this);
        item.on('enable', this.onItemEnabled, this);
        item.on('titlechange', this.onItemTitleChanged, this);
        item.on('beforeshow', this.onBeforeShowItem, this);
    },

        onAdd : function(tp, item, index){
        this.initTab(item, index);
        if(this.items.getCount() == 1){
            this.syncSize();
        }
        this.delegateUpdates();
    },

        onBeforeAdd : function(item){
        var existing = item.events ? (this.items.containsKey(item.getItemId()) ? item : null) : this.items.get(item);
        if(existing){
            this.setActiveTab(item);
            return false;
        }
        Wtf.TabPanel.superclass.onBeforeAdd.apply(this, arguments);
        var es = item.elements;
        item.elements = es ? es.replace(',header', '') : es;
        item.border = (item.border === true);
    },

        onRemove : function(tp, item){
        Wtf.removeNode(this.getTabEl(item));
        this.stack.remove(item);
        if(item == this.activeTab){
            var next = this.stack.next();
            if(next){
                this.setActiveTab(next);
            }else{
                this.setActiveTab(0);
            }
        }
        this.delegateUpdates();
    },

        onBeforeShowItem : function(item){
        if(item != this.activeTab){
            this.setActiveTab(item);
            return false;
        }
    },

        onItemDisabled : function(item){
        var el = this.getTabEl(item);
        if(el){
            Wtf.fly(el).addClass('x-item-disabled');
        }
        this.stack.remove(item);
    },

        onItemEnabled : function(item){
        var el = this.getTabEl(item);
        if(el){
            Wtf.fly(el).removeClass('x-item-disabled');
        }
    },

        onItemTitleChanged : function(item){
        var el = this.getTabEl(item);
        if(el){
            Wtf.fly(el).child('span.x-tab-strip-text', true).innerHTML = item.title;
        }
    },

    
    getTabEl : function(item){
        return document.getElementById(this.id+'__'+item.getItemId());
    },

        onResize : function(){
        Wtf.TabPanel.superclass.onResize.apply(this, arguments);
        this.delegateUpdates();
    },

    
    beginUpdate : function(){
        this.suspendUpdates = true;
    },

    
    endUpdate : function(){
        this.suspendUpdates = false;
        this.delegateUpdates();
    },

    
    hideTabStripItem : function(item){
        item = this.getComponent(item);
        var el = this.getTabEl(item);
        if(el){
            el.style.display = 'none';
            this.delegateUpdates();
        }
    },

    
    unhideTabStripItem : function(item){
        item = this.getComponent(item);
        var el = this.getTabEl(item);
        if(el){
            el.style.display = '';
            this.delegateUpdates();
        }
    },

        delegateUpdates : function(){
        if(this.suspendUpdates){
            return;
        }
        if(this.resizeTabs && this.rendered){
            this.autoSizeTabs();
        }
        if(this.enableTabScroll && this.rendered){
            this.autoScrollTabs();
        }
    },

        autoSizeTabs : function(){
        var count = this.items.length;
        var ce = this.tabPosition != 'bottom' ? 'header' : 'footer';
        var ow = this[ce].dom.offsetWidth;
        var aw = this[ce].dom.clientWidth;

        if(!this.resizeTabs || count < 1 || !aw){             return;
        }
        
        var each = Math.max(Math.min(Math.floor((aw-4) / count) - this.tabMargin, this.tabWidth), this.minTabWidth);         this.lastTabWidth = each;
        var lis = this.stripWrap.dom.getElementsByTagName('li');
        for(var i = 0, len = lis.length-1; i < len; i++) {             var li = lis[i];
            var inner = li.childNodes[1].firstChild.firstChild;
            var tw = li.offsetWidth;
            var iw = inner.offsetWidth;
            inner.style.width = (each - (tw-iw)) + 'px';
        }
    },

        adjustBodyWidth : function(w){
        if(this.header){
            this.header.setWidth(w);
        }
        if(this.footer){
            this.footer.setWidth(w);
        }
        return w;
    },

    
    setActiveTab : function(item){
        item = this.getComponent(item);
        if(!item || this.fireEvent('beforetabchange', this, item, this.activeTab) === false){
            return;
        }
        if(!this.rendered){
            this.activeTab = item;
            return;
        }
        if(this.activeTab != item){
            if(this.activeTab){
                var oldEl = this.getTabEl(this.activeTab);
                if(oldEl){
                    Wtf.fly(oldEl).removeClass('x-tab-strip-active');
                }
                this.activeTab.fireEvent('deactivate', this.activeTab);
            }
            var el = this.getTabEl(item);
            Wtf.fly(el).addClass('x-tab-strip-active');
            this.activeTab = item;
            this.stack.add(item);

            this.layout.setActiveItem(item);
            if(this.layoutOnTabChange && item.doLayout){
                item.doLayout();
            }
            if(this.scrolling){
                this.scrollToTab(item, this.animScroll);
            }

            item.fireEvent('activate', item);
            this.fireEvent('tabchange', this, item);
        }
    },

    
    getActiveTab : function(){
        return this.activeTab || null;
    },

    
    getItem : function(item){
        return this.getComponent(item);
    },

        autoScrollTabs : function(){
        var count = this.items.length;
        var ow = this.header.dom.offsetWidth;
        var tw = this.header.dom.clientWidth;

        var wrap = this.stripWrap;
        var cw = wrap.dom.offsetWidth;
        var pos = this.getScrollPos();
        var l = this.edge.getOffsetsTo(this.stripWrap)[0] + pos;

        if(!this.enableTabScroll || count < 1 || cw < 20){             return;
        }
        if(l <= tw){
            wrap.dom.scrollLeft = 0;
            wrap.setWidth(tw);
            if(this.scrolling){
                this.scrolling = false;
                this.header.removeClass('x-tab-scrolling');
                this.scrollLeft.hide();
                this.scrollRight.hide();
            }
        }else{
            if(!this.scrolling){
                this.header.addClass('x-tab-scrolling');
            }
            tw -= wrap.getMargins('lr');
            wrap.setWidth(tw > 20 ? tw : 20);
            if(!this.scrolling){
                if(!this.scrollLeft){
                    this.createScrollers();
                }else{
                    this.scrollLeft.show();
                    this.scrollRight.show();
                }
            }
            this.scrolling = true;
            if(pos > (l-tw)){                 wrap.dom.scrollLeft = l-tw;
            }else{                 this.scrollToTab(this.activeTab, false);
            }
            this.updateScrollButtons();
        }
    },

        createScrollers : function(){
        var h = this.stripWrap.dom.offsetHeight;

                var sl = this.header.insertFirst({
            cls:'x-tab-scroller-left'
        });
        sl.setHeight(h);
        sl.addClassOnOver('x-tab-scroller-left-over');
        this.leftRepeater = new Wtf.util.ClickRepeater(sl, {
            interval : this.scrollRepeatInterval,
            handler: this.onScrollLeft,
            scope: this
        });
        this.scrollLeft = sl;

                var sr = this.header.insertFirst({
            cls:'x-tab-scroller-right'
        });
        sr.setHeight(h);
        sr.addClassOnOver('x-tab-scroller-right-over');
        this.rightRepeater = new Wtf.util.ClickRepeater(sr, {
            interval : this.scrollRepeatInterval,
            handler: this.onScrollRight,
            scope: this
        });
        this.scrollRight = sr;
    },

        getScrollWidth : function(){
        return this.edge.getOffsetsTo(this.stripWrap)[0] + this.getScrollPos();
    },

        getScrollPos : function(){
        return parseInt(this.stripWrap.dom.scrollLeft, 10) || 0;
    },

        getScrollArea : function(){
        return parseInt(this.stripWrap.dom.clientWidth, 10) || 0;
    },

        getScrollAnim : function(){
        return {duration:this.scrollDuration, callback: this.updateScrollButtons, scope: this};
    },

        getScrollIncrement : function(){
        return this.scrollIncrement || (this.resizeTabs ? this.lastTabWidth+2 : 100);
    },

    

    scrollToTab : function(item, animate){
        if(!item){ return; }
        var el = this.getTabEl(item);
        var pos = this.getScrollPos(), area = this.getScrollArea();
        var left = Wtf.fly(el).getOffsetsTo(this.stripWrap)[0] + pos;
        var right = left + el.offsetWidth;
        if(left < pos){
            this.scrollTo(left, animate);
        }else if(right > (pos + area)){
            this.scrollTo(right - area, animate);
        }
    },

        scrollTo : function(pos, animate){
        this.stripWrap.scrollTo('left', pos, animate ? this.getScrollAnim() : false);
        if(!animate){
            this.updateScrollButtons();
        }
    },

    onWheel : function(e){
        var d = e.getWheelDelta()*this.wheelIncrement*-1;
        e.stopEvent();

        var pos = this.getScrollPos();
        var newpos = pos + d;
        var sw = this.getScrollWidth()-this.getScrollArea();

        var s = Math.max(0, Math.min(sw, newpos));
        if(s != pos){
            this.scrollTo(s, false);
        }
    },

        onScrollRight : function(){
        var sw = this.getScrollWidth()-this.getScrollArea();
        var pos = this.getScrollPos();
        var s = Math.min(sw, pos + this.getScrollIncrement());
        if(s != pos){
            this.scrollTo(s, this.animScroll);
        }        
    },

        onScrollLeft : function(){
        var pos = this.getScrollPos();
        var s = Math.max(0, pos - this.getScrollIncrement());
        if(s != pos){
            this.scrollTo(s, this.animScroll);
        }
    },

        updateScrollButtons : function(){
        var pos = this.getScrollPos();
        this.scrollLeft[pos == 0 ? 'addClass' : 'removeClass']('x-tab-scroller-left-disabled');
        this.scrollRight[pos >= (this.getScrollWidth()-this.getScrollArea()) ? 'addClass' : 'removeClass']('x-tab-scroller-right-disabled');
    }

    
    
    
    
});
Wtf.reg('tabpanel', Wtf.TabPanel);


Wtf.TabPanel.prototype.activate = Wtf.TabPanel.prototype.setActiveTab;

Wtf.TabPanel.AccessStack = function(){
    var items = [];
    return {
        add : function(item){
            items.push(item);
            if(items.length > 10){
                items.shift();
            }
        },

        remove : function(item){
            var s = [];
            for(var i = 0, len = items.length; i < len; i++) {
                if(items[i] != item){
                    s.push(items[i]);
                }
            }
            items = s;
        },

        next : function(){
            return items.pop();
        }
    };
};



Wtf.Button = Wtf.extend(Wtf.Component, {
    
    hidden : false,
    
    disabled : false,
    
    pressed : false,

    

    
    enableToggle: false,
    
    
    menuAlign : "tl-bl?",

    
    
    type : 'button',

    
    menuClassTarget: 'tr',

    
    clickEvent : 'click',

    
    handleMouseEvents : true,

    
    tooltipType : 'qtip',

    buttonSelector : "button:first",

    
    
    
    initComponent : function(){
        Wtf.Button.superclass.initComponent.call(this);

        this.addEvents(
            
            "click",
            
            "toggle",
            
            'mouseover',
            
            'mouseout',
            
            'menushow',
            
            'menuhide',
            
            'menutriggerover',
            
            'menutriggerout'
        );
        if(this.menu){
            this.menu = Wtf.menu.MenuMgr.get(this.menu);
        }
        if(typeof this.toggleGroup === 'string'){
            this.enableToggle = true;
        }
    },

    
    onRender : function(ct, position){
        if(!this.template){
            if(!Wtf.Button.buttonTemplate){
                
                Wtf.Button.buttonTemplate = new Wtf.Template(
                    '<table border="0" cellpadding="0" cellspacing="0" class="x-btn-wrap"><tbody><tr>',
                    '<td class="x-btn-left"><i>&#160;</i></td><td class="x-btn-center"><em unselectable="on"><button class="x-btn-text" type="{1}">{0}</button></em></td><td class="x-btn-right"><i>&#160;</i></td>',
                    "</tr></tbody></table>");
            }
            this.template = Wtf.Button.buttonTemplate;
        }
        var btn, targs = [this.text || '&#160;', this.type];

        if(position){
            btn = this.template.insertBefore(position, targs, true);
        }else{
            btn = this.template.append(ct, targs, true);
        }
        var btnEl = btn.child(this.buttonSelector);
        btnEl.on('focus', this.onFocus, this);
        btnEl.on('blur', this.onBlur, this);

        this.initButtonEl(btn, btnEl);

        if(this.menu){
            this.el.child(this.menuClassTarget).addClass("x-btn-with-menu");
        }
        Wtf.ButtonToggleMgr.register(this);
    },

    
    initButtonEl : function(btn, btnEl){

        this.el = btn;
        btn.addClass("x-btn");

        if(this.icon){
            btnEl.setStyle('background-image', 'url(' +this.icon +')');
        }
        if(this.iconCls){
            btnEl.addClass(this.iconCls);
            if(!this.cls){
                btn.addClass(this.text ? 'x-btn-text-icon' : 'x-btn-icon');
            }
        }
        if(this.tabIndex !== undefined){
            btnEl.dom.tabIndex = this.tabIndex;
        }
        if(this.tooltip){
            if(typeof this.tooltip == 'object'){
                Wtf.QuickTips.register(Wtf.apply({
                      target: btnEl.id
                }, this.tooltip));
            } else {
                btnEl.dom[this.tooltipType] = this.tooltip;
            }
        }

        if(this.pressed){
            this.el.addClass("x-btn-pressed");
        }

        if(this.handleMouseEvents){
            btn.on("mouseover", this.onMouseOver, this);
            
            
            btn.on("mousedown", this.onMouseDown, this);
        }

        if(this.menu){
            this.menu.on("show", this.onMenuShow, this);
            this.menu.on("hide", this.onMenuHide, this);
        }

        if(this.id){
            this.el.dom.id = this.el.id = this.id;
        }

        if(this.repeat){
            var repeater = new Wtf.util.ClickRepeater(btn,
                typeof this.repeat == "object" ? this.repeat : {}
            );
            repeater.on("click", this.onClick,  this);
        }

        btn.on(this.clickEvent, this.onClick, this);
    },

    
    afterRender : function(){
        Wtf.Button.superclass.afterRender.call(this);
        if(Wtf.isIE6){
            this.autoWidth.defer(1, this);
        }else{
            this.autoWidth();
        }
    },

    
    setIconClass : function(cls){
        if(this.el){
            this.el.child(this.buttonSelector).replaceClass(this.iconCls, cls);
        }
        this.iconCls = cls;
    },
    
    
    beforeDestroy: function(){
        var btn = this.el.child(this.buttonSelector);
        if(btn){
            btn.removeAllListeners();
        }
        if(this.menu){
            Wtf.destroy(this.menu);
        }
    },

    
    onDestroy : function(){
        if(this.rendered){
            Wtf.ButtonToggleMgr.unregister(this);
        }
    },

    
    autoWidth : function(){
        if(this.el){
            this.el.setWidth("auto");
            if(Wtf.isIE7 && Wtf.isStrict){
                var ib = this.el.child(this.buttonSelector);
                if(ib && ib.getWidth() > 20){
                    ib.clip();
                    ib.setWidth(Wtf.util.TextMetrics.measure(ib, this.text).width+ib.getFrameWidth('lr'));
                }
            }
            if(this.minWidth){
                if(this.el.getWidth() < this.minWidth){
                    this.el.setWidth(this.minWidth);
                }
            }
        }
    },

    
    setHandler : function(handler, scope){
        this.handler = handler;
        this.scope = scope;  
    },
    
    
    setText : function(text){
        this.text = text;
        if(this.el){
            this.el.child("td.x-btn-center " + this.buttonSelector).update(text);
        }
        this.autoWidth();
    },
    
    
    getText : function(){
        return this.text;  
    },
    
    
    toggle : function(state){
        state = state === undefined ? !this.pressed : state;
        if(state != this.pressed){
            if(state){
                this.el.addClass("x-btn-pressed");
                this.pressed = true;
                this.fireEvent("toggle", this, true);
            }else{
                this.el.removeClass("x-btn-pressed");
                this.pressed = false;
                this.fireEvent("toggle", this, false);
            }
            if(this.toggleHandler){
                this.toggleHandler.call(this.scope || this, this, state);
            }
        }
    },
    
    
    focus : function(){
        this.el.child(this.buttonSelector).focus();
    },
    
    
    onDisable : function(){
        if(this.el){
            if(!Wtf.isIE6){
                this.el.addClass("x-item-disabled");
            }
            this.el.dom.disabled = true;
        }
        this.disabled = true;
    },

    
    onEnable : function(){
        if(this.el){
            if(!Wtf.isIE6){
                this.el.removeClass("x-item-disabled");
            }
            this.el.dom.disabled = false;
        }
        this.disabled = false;
    },

    
    showMenu : function(){
        if(this.menu){
            this.menu.show(this.el, this.menuAlign);
        }
        return this;
    },

    
    hideMenu : function(){
        if(this.menu){
            this.menu.hide();
        }
        return this;
    },

    
    hasVisibleMenu : function(){
        return this.menu && this.menu.isVisible();
    },

    
    onClick : function(e){
        if(e){
            e.preventDefault();
        }
        if(e.button != 0){
            return;
        }
        if(!this.disabled){
            if(this.enableToggle && (this.allowDepress !== false || !this.pressed)){
                this.toggle();
            }
            if(this.menu && !this.menu.isVisible() && !this.ignoreNextClick){
                this.showMenu();
            }
            this.fireEvent("click", this, e);
            if(this.handler){
                
                this.handler.call(this.scope || this, this, e);
            }
        }
    },

    
    isMenuTriggerOver : function(e, internal){
        return this.menu && !internal;
    },

    
    isMenuTriggerOut : function(e, internal){
        return this.menu && !internal;
    },

    
    onMouseOver : function(e){
        if(!this.disabled){
            var internal = e.within(this.el,  true);
            if(!internal){
                this.el.addClass("x-btn-over");
                Wtf.getDoc().on('mouseover', this.monitorMouseOver, this);
                this.fireEvent('mouseover', this, e);
            }
            if(this.isMenuTriggerOver(e, internal)){
                this.fireEvent('menutriggerover', this, this.menu, e);
            }
        }
    },

    
    monitorMouseOver : function(e){
        if(e.target != this.el.dom && !e.within(this.el)){
            Wtf.getDoc().un('mouseover', this.monitorMouseOver, this);
            this.onMouseOut(e);
        }
    },

    
    onMouseOut : function(e){
        var internal = e.within(this.el) && e.target != this.el.dom;
        this.el.removeClass("x-btn-over");
        this.fireEvent('mouseout', this, e);
        if(this.isMenuTriggerOut(e), internal){
            this.fireEvent('menutriggerout', this, this.menu, e);
        }
    },
    
    onFocus : function(e){
        if(!this.disabled){
            this.el.addClass("x-btn-focus");
        }
    },
    
    onBlur : function(e){
        this.el.removeClass("x-btn-focus");
    },

    
    getClickEl : function(e, isUp){
       return this.el;
    },

    
    onMouseDown : function(e){
        if(!this.disabled && e.button == 0){
            this.getClickEl(e).addClass("x-btn-click");
            Wtf.getDoc().on('mouseup', this.onMouseUp, this);
        }
    },
    
    onMouseUp : function(e){
        if(e.button == 0){
            this.getClickEl(e, true).removeClass("x-btn-click");
            Wtf.getDoc().un('mouseup', this.onMouseUp, this);
        }
    },
    
    onMenuShow : function(e){
        this.ignoreNextClick = 0;
        this.el.addClass("x-btn-menu-active");
        this.fireEvent('menushow', this, this.menu);
    },
    
    onMenuHide : function(e){
        this.el.removeClass("x-btn-menu-active");
        this.ignoreNextClick = this.restoreClick.defer(250, this);
        this.fireEvent('menuhide', this, this.menu);
    },

    
    restoreClick : function(){
        this.ignoreNextClick = 0;
    }
});
Wtf.reg('button', Wtf.Button);


Wtf.ButtonToggleMgr = function(){
   var groups = {};
   
   function toggleGroup(btn, state){
       if(state){
           var g = groups[btn.toggleGroup];
           for(var i = 0, l = g.length; i < l; i++){
               if(g[i] != btn){
                   g[i].toggle(false);
               }
           }
       }
   }
   
   return {
       register : function(btn){
           if(!btn.toggleGroup){
               return;
           }
           var g = groups[btn.toggleGroup];
           if(!g){
               g = groups[btn.toggleGroup] = [];
           }
           g.push(btn);
           btn.on("toggle", toggleGroup);
       },
       
       unregister : function(btn){
           if(!btn.toggleGroup){
               return;
           }
           var g = groups[btn.toggleGroup];
           if(g){
               g.remove(btn);
               btn.un("toggle", toggleGroup);
           }
       }
   };
}();

Wtf.SplitButton = Wtf.extend(Wtf.Button, {
    arrowSelector : 'button:last',

    initComponent : function(){
        Wtf.SplitButton.superclass.initComponent.call(this);
        
        this.addEvents("arrowclick");
    },

    onRender : function(ct, position){
        
        var tpl = new Wtf.Template(
            '<table cellspacing="0" class="x-btn-menu-wrap x-btn"><tr><td>',
            '<table cellspacing="0" class="x-btn-wrap x-btn-menu-text-wrap"><tbody>',
            '<tr><td class="x-btn-left"><i>&#160;</i></td><td class="x-btn-center"><button class="x-btn-text" type="{1}">{0}</button></td></tr>',
            "</tbody></table></td><td>",
            '<table cellspacing="0" class="x-btn-wrap x-btn-menu-arrow-wrap"><tbody>',
            '<tr><td class="x-btn-center"><button class="x-btn-menu-arrow-el" type="button">&#160;</button></td><td class="x-btn-right"><i>&#160;</i></td></tr>',
            "</tbody></table></td></tr></table>"
        );
        var btn, targs = [this.text || '&#160;', this.type];
        if(position){
            btn = tpl.insertBefore(position, targs, true);
        }else{
            btn = tpl.append(ct, targs, true);
        }
        var btnEl = btn.child(this.buttonSelector);

        this.initButtonEl(btn, btnEl);
        this.arrowBtnTable = btn.child("table:last");
        if(this.arrowTooltip){
            btn.child(this.arrowSelector).dom[this.tooltipType] = this.arrowTooltip;
        }
    },

    
    autoWidth : function(){
        if(this.el){
            var tbl = this.el.child("table:first");
            var tbl2 = this.el.child("table:last");
            this.el.setWidth("auto");
            tbl.setWidth("auto");
            if(Wtf.isIE7 && Wtf.isStrict){
                var ib = this.el.child(this.buttonSelector);
                if(ib && ib.getWidth() > 20){
                    ib.clip();
                    ib.setWidth(Wtf.util.TextMetrics.measure(ib, this.text).width+ib.getFrameWidth('lr'));
                }
            }
            if(this.minWidth){
                if((tbl.getWidth()+tbl2.getWidth()) < this.minWidth){
                    tbl.setWidth(this.minWidth-tbl2.getWidth());
                }
            }
            this.el.setWidth(tbl.getWidth()+tbl2.getWidth());
        } 
    },

    
    setArrowHandler : function(handler, scope){
        this.arrowHandler = handler;
        this.scope = scope;  
    },

    
    onClick : function(e){
        e.preventDefault();
        if(!this.disabled){
            if(e.getTarget(".x-btn-menu-arrow-wrap")){
                if(this.menu && !this.menu.isVisible() && !this.ignoreNextClick){
                    this.showMenu();
                }
                this.fireEvent("arrowclick", this, e);
                if(this.arrowHandler){
                    this.arrowHandler.call(this.scope || this, this, e);
                }
            }else{
                if(this.enableToggle){
                    this.toggle();
                }
                this.fireEvent("click", this, e);
                if(this.handler){
                    this.handler.call(this.scope || this, this, e);
                }
            }
        }
    },

    getClickEl : function(e, isUp){
        if(!isUp){
            return (this.lastClickEl = e.getTarget("table", 10, true));
        }
        return this.lastClickEl;
    },

    onDisable : function(){
        if(this.el){
            if(!Wtf.isIE6){
                this.el.addClass("x-item-disabled");
            }
            this.el.child(this.buttonSelector).dom.disabled = true;
            this.el.child(this.arrowSelector).dom.disabled = true;
        }
        this.disabled = true;
    },

    onEnable : function(){
        if(this.el){
            if(!Wtf.isIE6){
                this.el.removeClass("x-item-disabled");
            }
            this.el.child(this.buttonSelector).dom.disabled = false;
            this.el.child(this.arrowSelector).dom.disabled = false;
        }
        this.disabled = false;
    },

    isMenuTriggerOver : function(e){
        return this.menu && e.within(this.arrowBtnTable) && !e.within(this.arrowBtnTable, true);
    },

    isMenuTriggerOut : function(e, internal){
        return this.menu && !e.within(this.arrowBtnTable);
    },

    onDestroy : function(){
        Wtf.destroy(this.arrowBtnTable);
        Wtf.SplitButton.superclass.onDestroy.call(this);
    }
});


Wtf.MenuButton = Wtf.SplitButton;


Wtf.reg('splitbutton', Wtf.SplitButton);

Wtf.CycleButton = Wtf.extend(Wtf.SplitButton, {
    
    
    
    

    
    getItemText : function(item){
        if(item && this.showText === true){
            var text = '';
            if(this.prependText){
                text += this.prependText;
            }
            text += item.text;
            return text;
        }
        return undefined;
    },

    
    setActiveItem : function(item, suppressEvent){
        if(item){
            if(!this.rendered){
                this.text = this.getItemText(item);
                this.iconCls = item.iconCls;
            }else{
                var t = this.getItemText(item);
                if(t){
                    this.setText(t);
                }
                this.setIconClass(item.iconCls);
            }
            this.activeItem = item;
            if(!suppressEvent){
                this.fireEvent('change', this, item);
            }
        }
    },

    
    getActiveItem : function(){
        return this.activeItem;
    },

    
    initComponent : function(){
        this.addEvents(
            
            "change"
        );

        if(this.changeHandler){
            this.on('change', this.changeHandler, this.scope||this);
            delete this.changeHandler;
        }

        this.itemCount = this.items.length;

        this.menu = {cls:'x-cycle-menu', items:[]};
        var checked;
        for(var i = 0, len = this.itemCount; i < len; i++){
            var item = this.items[i];
            item.group = item.group || this.id;
            item.itemIndex = i;
            item.checkHandler = this.checkHandler;
            item.scope = this;
            item.checked = item.checked || false;
            this.menu.items.push(item);
            if(item.checked){
                checked = item;
            }
        }
        this.setActiveItem(checked, true);
        Wtf.CycleButton.superclass.initComponent.call(this);

        this.on('click', this.toggleSelected, this);
    },

    
    checkHandler : function(item, pressed){
        if(pressed){
            this.setActiveItem(item);
        }
    },

    
    toggleSelected : function(){
        this.menu.render();
		
		var nextIdx, checkItem;
		for (var i = 1; i < this.itemCount; i++) {
			nextIdx = (this.activeItem.itemIndex + i) % this.itemCount;
			
			checkItem = this.menu.items.itemAt(nextIdx);
			
			if (!checkItem.disabled) {
				checkItem.setChecked(true);
				break;
			}
		}
    }
});
Wtf.reg('cycle', Wtf.CycleButton);
 
 Wtf.Toolbar = function(config){
    if(config instanceof Array){
        config = {buttons:config};
    }
    Wtf.Toolbar.superclass.constructor.call(this, config);
};

(function(){

var T = Wtf.Toolbar;

Wtf.extend(T, Wtf.BoxComponent, {

    trackMenus : true,

    
    initComponent : function(){
        T.superclass.initComponent.call(this);

        if(this.items){
            this.buttons = this.items;
        }
        this.items = new Wtf.util.MixedCollection(false, function(o){
            return o.itemId || o.id || Wtf.id();
        });
    },

    
    autoCreate: {
        cls:'x-toolbar x-small-editor',
        html:'<table cellspacing="0"><tr></tr></table>'
    },

    
    onRender : function(ct, position){
        this.el = ct.createChild(this.autoCreate, position);
        this.tr = this.el.child("tr", true);
    },

    
    afterRender : function(){
        T.superclass.afterRender.call(this);
        if(this.buttons){
            this.add.apply(this, this.buttons);
            delete this.buttons;
        }
    },

    
    add : function(){
        var a = arguments, l = a.length;
        for(var i = 0; i < l; i++){
            var el = a[i];
            if(el.isFormField){ 
                this.addField(el);
            }else if(el.render){ 
                this.addItem(el);
            }else if(typeof el == "string"){ 
                if(el == "separator" || el == "-"){
                    this.addSeparator();
                }else if(el == " "){
                    this.addSpacer();
                }else if(el == "->"){
                    this.addFill();
                }else{
                    this.addText(el);
                }
            }else if(el.tagName){ 
                this.addElement(el);
            }else if(typeof el == "object"){ 
                if(el.xtype){
                    this.addField(Wtf.ComponentMgr.create(el, 'button'));
                }else{
                    this.addButton(el);
                }
            }
        }
    },
    
    
    addSeparator : function(){
        return this.addItem(new T.Separator());
    },

    
    addSpacer : function(){
        return this.addItem(new T.Spacer());
    },

    
    addFill : function(){
        return this.addItem(new T.Fill());
    },

    
    addElement : function(el){
        return this.addItem(new T.Item(el));
    },
    
    
    addItem : function(item){
        var td = this.nextBlock();
        this.initMenuTracking(item);
        item.render(td);
        this.items.add(item);
        return item;
    },
    
    
    addButton : function(config){
        if(config instanceof Array){
            var buttons = [];
            for(var i = 0, len = config.length; i < len; i++) {
                buttons.push(this.addButton(config[i]));
            }
            return buttons;
        }
        var b = config;
        if(!(config instanceof T.Button)){
            b = config.split ? 
                new T.SplitButton(config) :
                new T.Button(config);
        }
        var td = this.nextBlock();
        this.initMenuTracking(b);
        b.render(td);
        this.items.add(b);
        return b;
    },

    
    initMenuTracking : function(item){
        if(this.trackMenus && item.menu){
            item.on({
                'menutriggerover' : this.onButtonTriggerOver,
                'menushow' : this.onButtonMenuShow,
                'menuhide' : this.onButtonMenuHide,
                scope: this
            })
        }
    },

    
    addText : function(text){
        return this.addItem(new T.TextItem(text));
    },
    
    
    insertButton : function(index, item){
        if(item instanceof Array){
            var buttons = [];
            for(var i = 0, len = item.length; i < len; i++) {
               buttons.push(this.insertButton(index + i, item[i]));
            }
            return buttons;
        }
        if (!(item instanceof T.Button)){
           item = new T.Button(item);
        }
        var td = document.createElement("td");
        this.tr.insertBefore(td, this.tr.childNodes[index]);
        this.initMenuTracking(item);
        item.render(td);
        this.items.insert(index, item);
        return item;
    },
    
    
    addDom : function(config, returnEl){
        var td = this.nextBlock();
        Wtf.DomHelper.overwrite(td, config);
        var ti = new T.Item(td.firstChild);
        ti.render(td);
        this.items.add(ti);
        return ti;
    },

    
    addField : function(field){
        var td = this.nextBlock();
        field.render(td);
        var ti = new T.Item(td.firstChild);
        ti.render(td);
        this.items.add(ti);
        return ti;
    },

    
    nextBlock : function(){
        var td = document.createElement("td");
        this.tr.appendChild(td);
        return td;
    },

    
    onDestroy : function(){
        Wtf.Toolbar.superclass.onDestroy.call(this);
        if(this.rendered){
            if(this.items){ 
                Wtf.destroy.apply(Wtf, this.items.items);
            }
            Wtf.Element.uncache(this.tr);
        }
    },

    
    onDisable : function(){
        this.items.each(function(item){
             if(item.disable){
                 item.disable();
             }
        });
    },

    
    onEnable : function(){
        this.items.each(function(item){
             if(item.enable){
                 item.enable();
             }
        });
    },

    
    onButtonTriggerOver : function(btn){
        if(this.activeMenuBtn && this.activeMenuBtn != btn){
            this.activeMenuBtn.hideMenu();
            btn.showMenu();
            this.activeMenuBtn = btn;
        }
    },

    
    onButtonMenuShow : function(btn){
        this.activeMenuBtn = btn;
    },

    
    onButtonMenuHide : function(btn){
        delete this.activeMenuBtn;
    }
});
Wtf.reg('toolbar', Wtf.Toolbar);


T.Item = function(el){
    this.el = Wtf.getDom(el);
    this.id = Wtf.id(this.el);
    this.hidden = false;
};

T.Item.prototype = {
    
    
    getEl : function(){
       return this.el;  
    },

    
    render : function(td){
        this.td = td;
        td.appendChild(this.el);
    },
    
    
    destroy : function(){
        if(this.td && this.td.parentNode){
            this.td.parentNode.removeChild(this.td);
        }
    },
    
    
    show: function(){
        this.hidden = false;
        this.td.style.display = "";
    },
    
    
    hide: function(){
        this.hidden = true;
        this.td.style.display = "none";
    },
    
    
    setVisible: function(visible){
        if(visible) {
            this.show();
        }else{
            this.hide();
        }
    },
    
    
    focus : function(){
        Wtf.fly(this.el).focus();
    },
    
    
    disable : function(){
        Wtf.fly(this.td).addClass("x-item-disabled");
        this.disabled = true;
        this.el.disabled = true;
    },
    
    
    enable : function(){
        Wtf.fly(this.td).removeClass("x-item-disabled");
        this.disabled = false;
        this.el.disabled = false;
    }
};
Wtf.reg('tbitem', T.Item);



T.Separator = function(){
    var s = document.createElement("span");
    s.className = "ytb-sep";
    T.Separator.superclass.constructor.call(this, s);
};
Wtf.extend(T.Separator, T.Item, {
    enable:Wtf.emptyFn,
    disable:Wtf.emptyFn,
    focus:Wtf.emptyFn
});
Wtf.reg('tbseparator', T.Separator);


T.Spacer = function(){
    var s = document.createElement("div");
    s.className = "ytb-spacer";
    T.Spacer.superclass.constructor.call(this, s);
};
Wtf.extend(T.Spacer, T.Item, {
    enable:Wtf.emptyFn,
    disable:Wtf.emptyFn,
    focus:Wtf.emptyFn
});

Wtf.reg('tbspacer', T.Spacer);


T.Fill = Wtf.extend(T.Spacer, {
    
    render : function(td){
        td.style.width = '100%';
        T.Fill.superclass.render.call(this, td);
    }
});
Wtf.reg('tbfill', T.Fill);


T.TextItem = function(text){
    var s = document.createElement("span");
    s.className = "ytb-text";
    s.innerHTML = text;
    T.TextItem.superclass.constructor.call(this, s);
};
Wtf.extend(T.TextItem, T.Item, {
    enable:Wtf.emptyFn,
    disable:Wtf.emptyFn,
    focus:Wtf.emptyFn
});
Wtf.reg('tbtext', T.TextItem);



T.Button = Wtf.extend(Wtf.Button, {
    hideParent : true,

    onDestroy : function(){
        T.Button.superclass.onDestroy.call(this);
        if(this.container){
            this.container.remove();
        }
    }
});
Wtf.reg('tbbutton', T.Button);


T.SplitButton = Wtf.extend(Wtf.SplitButton, {
    hideParent : true,

    onDestroy : function(){
        T.SplitButton.superclass.onDestroy.call(this);
        if(this.container){
            this.container.remove();
        }
    }
});

Wtf.reg('tbsplit', T.SplitButton);

T.MenuButton = T.SplitButton;

})();


Wtf.PagingToolbar = Wtf.extend(Wtf.Toolbar, {
    
    
    
    pageSize: 20,
    
    displayMsg : 'Displaying {0} - {1} of {2}',
    
    emptyMsg : 'No data to display',
    
    beforePageText : "Page",
    
    afterPageText : "of {0}",
    
    firstText : "First Page",
    
    prevText : "Previous Page",
    
    nextText : "Next Page",
    
    lastText : "Last Page",
    
    refreshText : "Refresh",

    
    paramNames : {start: 'start', limit: 'limit'},

    initComponent : function(){
        Wtf.PagingToolbar.superclass.initComponent.call(this);
        this.cursor = 0;
        this.bind(this.store);
    },

        onRender : function(ct, position){
        Wtf.PagingToolbar.superclass.onRender.call(this, ct, position);
        this.first = this.addButton({
            tooltip: this.firstText,
            iconCls: "x-tbar-page-first",
            disabled: true,
            handler: this.onClick.createDelegate(this, ["first"])
        });
        this.prev = this.addButton({
            tooltip: this.prevText,
            iconCls: "x-tbar-page-prev",
            disabled: true,
            handler: this.onClick.createDelegate(this, ["prev"])
        });
        this.addSeparator();
        this.add(this.beforePageText);
        this.field = Wtf.get(this.addDom({
           tag: "input",
           type: "text",
           size: "3",
           value: "1",
           cls: "x-tbar-page-number"
        }).el);
        this.field.on("keydown", this.onPagingKeydown, this);
        this.field.on("focus", function(){this.dom.select();});
        this.afterTextEl = this.addText(String.format(this.afterPageText, 1));
        this.field.setHeight(18);
        this.addSeparator();
        this.next = this.addButton({
            tooltip: this.nextText,
            iconCls: "x-tbar-page-next",
            disabled: true,
            handler: this.onClick.createDelegate(this, ["next"])
        });
        this.last = this.addButton({
            tooltip: this.lastText,
            iconCls: "x-tbar-page-last",
            disabled: true,
            handler: this.onClick.createDelegate(this, ["last"])
        });
        this.addSeparator();
        this.loading = this.addButton({
            tooltip: this.refreshText,
            iconCls: "x-tbar-loading",
            handler: this.onClick.createDelegate(this, ["refresh"])
        });

        if(this.displayInfo){
            this.displayEl = Wtf.fly(this.el.dom).createChild({cls:'x-paging-info'});
        }
        if(this.dsLoaded){
            this.onLoad.apply(this, this.dsLoaded);
        }
    },

        updateInfo : function(){
        if(this.displayEl){
            var count = this.store.getCount();
            var msg = count == 0 ?
                this.emptyMsg :
                String.format(
                    this.displayMsg,
                    this.cursor+1, this.cursor+count, this.store.getTotalCount()
                );
            this.displayEl.update(msg);
        }
    },

        onLoad : function(store, r, o){
        if(!this.rendered){
            this.dsLoaded = [store, r, o];
            return;
        }
       this.cursor = o.params ? o.params[this.paramNames.start] : 0;
       var d = this.getPageData(), ap = d.activePage, ps = d.pages;

       this.afterTextEl.el.innerHTML = String.format(this.afterPageText, d.pages);
       this.field.dom.value = ap;
       this.first.setDisabled(ap == 1);
       this.prev.setDisabled(ap == 1);
       this.next.setDisabled(ap == ps);
       this.last.setDisabled(ap == ps);
       this.loading.enable();
       this.updateInfo();
    },

        getPageData : function(){
        var total = this.store.getTotalCount();
        return {
            total : total,
            activePage : Math.ceil((this.cursor+this.pageSize)/this.pageSize),
            pages :  total < this.pageSize ? 1 : Math.ceil(total/this.pageSize)
        };
    },

        onLoadError : function(){
        if(!this.rendered){
            return;
        }
        this.loading.enable();
    },

    readPage : function(d){
        var v = this.field.dom.value, pageNum;
        if (!v || isNaN(pageNum = parseInt(v, 10))) {
            this.field.dom.value = d.activePage;
            return false;
        }
        return pageNum;
    },

        onPagingKeydown : function(e){
        var k = e.getKey(), d = this.getPageData(), pageNum;
        if (k == e.RETURN) {
            e.stopEvent();
            if(pageNum = this.readPage(d)){
                pageNum = Math.min(Math.max(1, pageNum), d.pages) - 1;
                this.doLoad(pageNum * this.pageSize);
            }
        }else if (k == e.HOME || k == e.END){
            e.stopEvent();
            pageNum = k == e.HOME ? 1 : d.pages;
            this.field.dom.value = pageNum;
        }else if (k == e.UP || k == e.PAGEUP || k == e.DOWN || k == e.PAGEDOWN){
            e.stopEvent();
            if(pageNum = this.readPage(d)){
                var increment = e.shiftKey ? 10 : 1;
                if(k == e.DOWN || k == e.PAGEDOWN){
                    increment *= -1;
                }
                pageNum += increment;
                if(pageNum >= 1 & pageNum <= d.pages){
                    this.field.dom.value = pageNum;
                }
            }
        }
    },

        beforeLoad : function(){
        if(this.rendered && this.loading){
            this.loading.disable();
        }
    },

    doLoad : function(start){
        var o = {}, pn = this.paramNames;
        o[pn.start] = start;
        o[pn.limit] = this.pageSize;
        this.store.load({params:o});
    },

        onClick : function(which){
        var store = this.store;
        switch(which){
            case "first":
                this.doLoad(0);
            break;
            case "prev":
                this.doLoad(Math.max(0, this.cursor-this.pageSize));
            break;
            case "next":
                this.doLoad(this.cursor+this.pageSize);
            break;
            case "last":
                var total = store.getTotalCount();
                var extra = total % this.pageSize;
                var lastStart = extra ? (total - extra) : total-this.pageSize;
                this.doLoad(lastStart);
            break;
            case "refresh":
                this.doLoad(this.cursor);
            break;
        }
    },

    
    unbind : function(store){
        store = Wtf.StoreMgr.lookup(store);
        store.un("beforeload", this.beforeLoad, this);
        store.un("load", this.onLoad, this);
        store.un("loadexception", this.onLoadError, this);
        this.store = undefined;
    },

    
    bind : function(store){
        store = Wtf.StoreMgr.lookup(store);
        store.on("beforeload", this.beforeLoad, this);
        store.on("load", this.onLoad, this);
        store.on("loadexception", this.onLoadError, this);
        this.store = store;
    }
});
Wtf.reg('paging', Wtf.PagingToolbar);

Wtf.Resizable = function(el, config){
    this.el = Wtf.get(el);
    
    if(config && config.wrap){
        config.resizeChild = this.el;
        this.el = this.el.wrap(typeof config.wrap == "object" ? config.wrap : {cls:"xresizable-wrap"});
        this.el.id = this.el.dom.id = config.resizeChild.id + "-rzwrap";
        this.el.setStyle("overflow", "hidden");
        this.el.setPositioning(config.resizeChild.getPositioning());
        config.resizeChild.clearPositioning();
        if(!config.width || !config.height){
            var csize = config.resizeChild.getSize();
            this.el.setSize(csize.width, csize.height);
        }
        if(config.pinned && !config.adjustments){
            config.adjustments = "auto";
        }
    }

    this.proxy = this.el.createProxy({tag: "div", cls: "x-resizable-proxy", id: this.el.id + "-rzproxy"});
    this.proxy.unselectable();
    this.proxy.enableDisplayMode('block');

    Wtf.apply(this, config);
    
    if(this.pinned){
        this.disableTrackOver = true;
        this.el.addClass("x-resizable-pinned");
    }
        var position = this.el.getStyle("position");
    if(position != "absolute" && position != "fixed"){
        this.el.setStyle("position", "relative");
    }
    if(!this.handles){         this.handles = 's,e,se';
        if(this.multiDirectional){
            this.handles += ',n,w';
        }
    }
    if(this.handles == "all"){
        this.handles = "n s e w ne nw se sw";
    }
    var hs = this.handles.split(/\s*?[,;]\s*?| /);
    var ps = Wtf.Resizable.positions;
    for(var i = 0, len = hs.length; i < len; i++){
        if(hs[i] && ps[hs[i]]){
            var pos = ps[hs[i]];
            this[pos] = new Wtf.Resizable.Handle(this, pos, this.disableTrackOver, this.transparent);
        }
    }
        this.corner = this.southeast;
    
    if(this.handles.indexOf("n") != -1 || this.handles.indexOf("w") != -1){
        this.updateBox = true;
    }   
   
    this.activeHandle = null;
    
    if(this.resizeChild){
        if(typeof this.resizeChild == "boolean"){
            this.resizeChild = Wtf.get(this.el.dom.firstChild, true);
        }else{
            this.resizeChild = Wtf.get(this.resizeChild, true);
        }
    }
    
    if(this.adjustments == "auto"){
        var rc = this.resizeChild;
        var hw = this.west, he = this.east, hn = this.north, hs = this.south;
        if(rc && (hw || hn)){
            rc.position("relative");
            rc.setLeft(hw ? hw.el.getWidth() : 0);
            rc.setTop(hn ? hn.el.getHeight() : 0);
        }
        this.adjustments = [
            (he ? -he.el.getWidth() : 0) + (hw ? -hw.el.getWidth() : 0),
            (hn ? -hn.el.getHeight() : 0) + (hs ? -hs.el.getHeight() : 0) -1 
        ];
    }
    
    if(this.draggable){
        this.dd = this.dynamic ? 
            this.el.initDD(null) : this.el.initDDProxy(null, {dragElId: this.proxy.id});
        this.dd.setHandleElId(this.resizeChild ? this.resizeChild.id : this.el.id);
    }
    
        this.addEvents(
        "beforeresize",
        "resize"
    );
    
    if(this.width !== null && this.height !== null){
        this.resizeTo(this.width, this.height);
    }else{
        this.updateChildSize();
    }
    if(Wtf.isIE){
        this.el.dom.style.zoom = 1;
    }
    Wtf.Resizable.superclass.constructor.call(this);
};

Wtf.extend(Wtf.Resizable, Wtf.util.Observable, {
        resizeChild : false,
        adjustments : [0, 0],
        minWidth : 5,
        minHeight : 5,
        maxWidth : 10000,
        maxHeight : 10000,
        enabled : true,
        animate : false,
        duration : .35,
        dynamic : false,
        handles : false,
        multiDirectional : false,
        disableTrackOver : false,
        easing : 'easeOutStrong',
        widthIncrement : 0,
        heightIncrement : 0,
        pinned : false,
        width : null,
        height : null,
        preserveRatio : false,
        transparent: false,
        minX: 0,
        minY: 0,
        draggable: false,

        
        

        
        
    
    
    resizeTo : function(width, height){
        this.el.setSize(width, height);
        this.updateChildSize();
        this.fireEvent("resize", this, width, height, null);
    },

        startSizing : function(e, handle){
        this.fireEvent("beforeresize", this, e);
        if(this.enabled){ 
            if(!this.overlay){
                this.overlay = this.el.createProxy({tag: "div", cls: "x-resizable-overlay", html: "&#160;"}, Wtf.getBody());
                this.overlay.unselectable();
                this.overlay.enableDisplayMode("block");
                this.overlay.on("mousemove", this.onMouseMove, this);
                this.overlay.on("mouseup", this.onMouseUp, this);
            }
            this.overlay.setStyle("cursor", handle.el.getStyle("cursor"));

            this.resizing = true;
            this.startBox = this.el.getBox();
            this.startPoint = e.getXY();
            this.offsets = [(this.startBox.x + this.startBox.width) - this.startPoint[0],
                            (this.startBox.y + this.startBox.height) - this.startPoint[1]];

            this.overlay.setSize(Wtf.lib.Dom.getViewWidth(true), Wtf.lib.Dom.getViewHeight(true));
            this.overlay.show();

            if(this.constrainTo) {
                var ct = Wtf.get(this.constrainTo);
                this.resizeRegion = ct.getRegion().adjust(
                    ct.getFrameWidth('t'),
                    ct.getFrameWidth('l'),
                    -ct.getFrameWidth('b'),
                    -ct.getFrameWidth('r')
                );
            }

            this.proxy.setStyle('visibility', 'hidden');             this.proxy.show();
            this.proxy.setBox(this.startBox);
            if(!this.dynamic){
                this.proxy.setStyle('visibility', 'visible');
            }
        }
    },

        onMouseDown : function(handle, e){
        if(this.enabled){
            e.stopEvent();
            this.activeHandle = handle;
            this.startSizing(e, handle);
        }          
    },

        onMouseUp : function(e){
        var size = this.resizeElement();
        this.resizing = false;
        this.handleOut();
        this.overlay.hide();
        this.proxy.hide();
        this.fireEvent("resize", this, size.width, size.height, e);
    },

        updateChildSize : function(){
        if(this.resizeChild){
            var el = this.el;
            var child = this.resizeChild;
            var adj = this.adjustments;
            if(el.dom.offsetWidth){
                var b = el.getSize(true);
                child.setSize(b.width+adj[0], b.height+adj[1]);
            }
                                                            if(Wtf.isIE){
                setTimeout(function(){
                    if(el.dom.offsetWidth){
                        var b = el.getSize(true);
                        child.setSize(b.width+adj[0], b.height+adj[1]);
                    }
                }, 10);
            }
        }
    },

        snap : function(value, inc, min){
        if(!inc || !value) return value;
        var newValue = value;
        var m = value % inc;
        if(m > 0){
            if(m > (inc/2)){
                newValue = value + (inc-m);
            }else{
                newValue = value - m;
            }
        }
        return Math.max(min, newValue);
    },

        resizeElement : function(){
        var box = this.proxy.getBox();
        if(this.updateBox){
            this.el.setBox(box, false, this.animate, this.duration, null, this.easing);
        }else{
            this.el.setSize(box.width, box.height, this.animate, this.duration, null, this.easing);
        }
        this.updateChildSize();
        if(!this.dynamic){
            this.proxy.hide();
        }
        return box;
    },

        constrain : function(v, diff, m, mx){
        if(v - diff < m){
            diff = v - m;    
        }else if(v - diff > mx){
            diff = mx - v; 
        }
        return diff;                
    },

        onMouseMove : function(e){
        if(this.enabled){
            try{
            if(this.resizeRegion && !this.resizeRegion.contains(e.getPoint())) {
            	return;
            }

                        var curSize = this.curSize || this.startBox;
            var x = this.startBox.x, y = this.startBox.y;
            var ox = x, oy = y;
            var w = curSize.width, h = curSize.height;
            var ow = w, oh = h;
            var mw = this.minWidth, mh = this.minHeight;
            var mxw = this.maxWidth, mxh = this.maxHeight;
            var wi = this.widthIncrement;
            var hi = this.heightIncrement;
            
            var eventXY = e.getXY();
            var diffX = -(this.startPoint[0] - Math.max(this.minX, eventXY[0]));
            var diffY = -(this.startPoint[1] - Math.max(this.minY, eventXY[1]));
            
            var pos = this.activeHandle.position;
            
            switch(pos){
                case "east":
                    w += diffX; 
                    w = Math.min(Math.max(mw, w), mxw);
                    break;
                case "south":
                    h += diffY;
                    h = Math.min(Math.max(mh, h), mxh);
                    break;
                case "southeast":
                    w += diffX; 
                    h += diffY;
                    w = Math.min(Math.max(mw, w), mxw);
                    h = Math.min(Math.max(mh, h), mxh);
                    break;
                case "north":
                    diffY = this.constrain(h, diffY, mh, mxh);
                    y += diffY;
                    h -= diffY;
                    break;
                case "west":
                    diffX = this.constrain(w, diffX, mw, mxw);
                    x += diffX;
                    w -= diffX;
                    break;
                case "northeast":
                    w += diffX; 
                    w = Math.min(Math.max(mw, w), mxw);
                    diffY = this.constrain(h, diffY, mh, mxh);
                    y += diffY;
                    h -= diffY;
                    break;
                case "northwest":
                    diffX = this.constrain(w, diffX, mw, mxw);
                    diffY = this.constrain(h, diffY, mh, mxh);
                    y += diffY;
                    h -= diffY;
                    x += diffX;
                    w -= diffX;
                    break;
               case "southwest":
                    diffX = this.constrain(w, diffX, mw, mxw);
                    h += diffY;
                    h = Math.min(Math.max(mh, h), mxh);
                    x += diffX;
                    w -= diffX;
                    break;
            }
            
            var sw = this.snap(w, wi, mw);
            var sh = this.snap(h, hi, mh);
            if(sw != w || sh != h){
                switch(pos){
                    case "northeast":
                        y -= sh - h;
                    break;
                    case "north":
                        y -= sh - h;
                        break;
                    case "southwest":
                        x -= sw - w;
                    break;
                    case "west":
                        x -= sw - w;
                        break;
                    case "northwest":
                        x -= sw - w;
                        y -= sh - h;
                    break;
                }
                w = sw;
                h = sh;
            }
            
            if(this.preserveRatio){
                switch(pos){
                    case "southeast":
                    case "east":
                        h = oh * (w/ow);
                        h = Math.min(Math.max(mh, h), mxh);
                        w = ow * (h/oh);
                       break;
                    case "south":
                        w = ow * (h/oh);
                        w = Math.min(Math.max(mw, w), mxw);
                        h = oh * (w/ow);
                        break;
                    case "northeast":
                        w = ow * (h/oh);
                        w = Math.min(Math.max(mw, w), mxw);
                        h = oh * (w/ow);
                    break;
                    case "north":
                        var tw = w;
                        w = ow * (h/oh);
                        w = Math.min(Math.max(mw, w), mxw);
                        h = oh * (w/ow);
                        x += (tw - w) / 2;
                        break;
                    case "southwest":
                        h = oh * (w/ow);
                        h = Math.min(Math.max(mh, h), mxh);
                        var tw = w;
                        w = ow * (h/oh);
                        x += tw - w;
                        break;
                    case "west":
                        var th = h;
                        h = oh * (w/ow);
                        h = Math.min(Math.max(mh, h), mxh);
                        y += (th - h) / 2;
                        var tw = w;
                        w = ow * (h/oh);
                        x += tw - w;
                       break;
                    case "northwest":
                        var tw = w;
                        var th = h;
                        h = oh * (w/ow);
                        h = Math.min(Math.max(mh, h), mxh);
                        w = ow * (h/oh);
                        y += th - h;
                         x += tw - w;
                       break;
                        
                }
            }
            this.proxy.setBounds(x, y, w, h);
            if(this.dynamic){
                this.resizeElement();
            }
            }catch(e){}
        }
    },

        handleOver : function(){
        if(this.enabled){
            this.el.addClass("x-resizable-over");
        }
    },

        handleOut : function(){
        if(!this.resizing){
            this.el.removeClass("x-resizable-over");
        }
    },
    
    
    getEl : function(){
        return this.el;
    },
    
    
    getResizeChild : function(){
        return this.resizeChild;
    },
    
    
    destroy : function(removeEl){
        this.proxy.remove();
        if(this.overlay){
            this.overlay.removeAllListeners();
            this.overlay.remove();
        }
        var ps = Wtf.Resizable.positions;
        for(var k in ps){
            if(typeof ps[k] != "function" && this[ps[k]]){
                var h = this[ps[k]];
                h.el.removeAllListeners();
                h.el.remove();
            }
        }
        if(removeEl){
            this.el.update("");
            this.el.remove();
        }
    },

    syncHandleHeight : function(){
        var h = this.el.getHeight(true);
        if(this.west){
            this.west.el.setHeight(h);
        }
        if(this.east){
            this.east.el.setHeight(h);
        }
    }
});

Wtf.Resizable.positions = {
    n: "north", s: "south", e: "east", w: "west", se: "southeast", sw: "southwest", nw: "northwest", ne: "northeast"
};

Wtf.Resizable.Handle = function(rz, pos, disableTrackOver, transparent){
    if(!this.tpl){
                var tpl = Wtf.DomHelper.createTemplate(
            {tag: "div", cls: "x-resizable-handle x-resizable-handle-{0}"}
        );
        tpl.compile();
        Wtf.Resizable.Handle.prototype.tpl = tpl;
    }
    this.position = pos;
    this.rz = rz;
    this.el = this.tpl.append(rz.el.dom, [this.position], true);
    this.el.unselectable();
    if(transparent){
        this.el.setOpacity(0);
    }
    this.el.on("mousedown", this.onMouseDown, this);
    if(!disableTrackOver){
        this.el.on("mouseover", this.onMouseOver, this);
        this.el.on("mouseout", this.onMouseOut, this);
    }
};

Wtf.Resizable.Handle.prototype = {
    afterResize : function(rz){
            },
        onMouseDown : function(e){
        this.rz.onMouseDown(this, e);
    },
        onMouseOver : function(e){
        this.rz.handleOver(this, e);
    },
        onMouseOut : function(e){
        this.rz.handleOut(this, e);
    }  
};




Wtf.Editor = function(field, config){
    this.field = field;
    Wtf.Editor.superclass.constructor.call(this, config);
};

Wtf.extend(Wtf.Editor, Wtf.Component, {
    
    
    
    
    
    value : "",
    
    alignment: "c-c?",
    
    shadow : "frame",
    
    constrain : false,
    
    swallowKeys : true,
    
    completeOnEnter : false,
    
    cancelOnEsc : false,
    
    updateEl : false,

    initComponent : function(){
        Wtf.Editor.superclass.initComponent.call(this);

        this.addEvents(
            
            "beforestartedit",
            
            "startedit",
            
            "beforecomplete",
            
            "complete",
            
            "specialkey"
        );
    },

        onRender : function(ct, position){
        this.el = new Wtf.Layer({
            shadow: this.shadow,
            cls: "x-editor",
            parentEl : ct,
            shim : this.shim,
            shadowOffset:4,
            id: this.id,
            constrain: this.constrain
        });
        this.el.setStyle("overflow", Wtf.isGecko ? "auto" : "hidden");
        if(this.field.msgTarget != 'title'){
            this.field.msgTarget = 'qtip';
        }
        this.field.render(this.el);
        if(Wtf.isGecko){
            this.field.el.dom.setAttribute('autocomplete', 'off');
        }
        this.field.on("specialkey", this.onSpecialKey, this);
        if(this.swallowKeys){
            this.field.el.swallowEvent(['keydown','keypress']);
        }
        this.field.show();
        this.field.on("blur", this.onBlur, this);
        if(this.field.grow){
            this.field.on("autosize", this.el.sync,  this.el, {delay:1});
        }
    },

    onSpecialKey : function(field, e){
        if(this.completeOnEnter && e.getKey() == e.ENTER){
            e.stopEvent();
            this.completeEdit();
        }else if(this.cancelOnEsc && e.getKey() == e.ESC){
            this.cancelEdit();
        }else{
            this.fireEvent('specialkey', field, e);
        }
    },

    
    startEdit : function(el, value){
        if(this.editing){
            this.completeEdit();
        }
        this.boundEl = Wtf.get(el);
        var v = value !== undefined ? value : this.boundEl.dom.innerHTML;
        if(!this.rendered){
            this.render(this.parentEl || document.body);
        }
        if(this.fireEvent("beforestartedit", this, this.boundEl, v) === false){
            return;
        }
        this.startValue = v;
        this.field.setValue(v);
        if(this.autoSize){
            var sz = this.boundEl.getSize();
            switch(this.autoSize){
                case "width":
                this.setSize(sz.width,  "");
                break;
                case "height":
                this.setSize("",  sz.height);
                break;
                default:
                this.setSize(sz.width,  sz.height);
            }
        }
        this.el.alignTo(this.boundEl, this.alignment);
        this.editing = true;
        this.show();
    },

    
    setSize : function(w, h){
        this.field.setSize(w, h);
        if(this.el){
            this.el.sync();
        }
    },

    
    realign : function(){
        this.el.alignTo(this.boundEl, this.alignment);
    },

    
    completeEdit : function(remainVisible){
        if(!this.editing){
            return;
        }
        var v = this.getValue();
        if(this.revertInvalid !== false && !this.field.isValid()){
            v = this.startValue;
            this.cancelEdit(true);
        }
        if(String(v) === String(this.startValue) && this.ignoreNoChange){
            this.editing = false;
            this.hide();
            return;
        }
        if(this.fireEvent("beforecomplete", this, v, this.startValue) !== false){
            this.editing = false;
            if(this.updateEl && this.boundEl){
                this.boundEl.update(v);
            }
            if(remainVisible !== true){
                this.hide();
            }
            this.fireEvent("complete", this, v, this.startValue);
        }
    },

        onShow : function(){
        this.el.show();
        if(this.hideEl !== false){
            this.boundEl.hide();
        }
        this.field.show();
        if(Wtf.isIE && !this.fixIEFocus){             this.fixIEFocus = true;
            this.deferredFocus.defer(50, this);
        }else{
            this.field.focus();
        }
        this.fireEvent("startedit", this.boundEl, this.startValue);
    },

    deferredFocus : function(){
        if(this.editing){
            this.field.focus();
        }
    },

    
    cancelEdit : function(remainVisible){
        if(this.editing){
            this.setValue(this.startValue);
            if(remainVisible !== true){
                this.hide();
            }
        }
    },

        onBlur : function(){
        if(this.allowBlur !== true && this.editing){
            this.completeEdit();
        }
    },

        onHide : function(){
        if(this.editing){
            this.completeEdit();
            return;
        }
        this.field.blur();
        if(this.field.collapse){
            this.field.collapse();
        }
        this.el.hide();
        if(this.hideEl !== false){
            this.boundEl.show();
        }
    },

    
    setValue : function(v){
        this.field.setValue(v);
    },

    
    getValue : function(){
        return this.field.getValue();
    },

    beforeDestroy : function(){
        this.field.destroy();
        this.field = null;
    }
});
Wtf.reg('editor', Wtf.Editor);

Wtf.MessageBox = function(){
    var dlg, opt, mask, waitTimer;
    var bodyEl, msgEl, textboxEl, textareaEl, progressBar, pp, iconEl, spacerEl;
    var buttons, activeTextEl, bwidth, iconCls = '';

    
    var handleButton = function(button){
        dlg.hide();
        Wtf.callback(opt.fn, opt.scope||window, [button, activeTextEl.dom.value], 1);
    };

    
    var handleHide = function(){
        if(opt && opt.cls){
            dlg.el.removeClass(opt.cls);
        }
        progressBar.reset();
    };

    
    var handleEsc = function(d, k, e){
        if(opt && opt.closable !== false){
            dlg.hide();
        }
        if(e){
            e.stopEvent();
        }
    };

    
    var updateButtons = function(b){
        var width = 0;
        if(!b){
            buttons["ok"].hide();
            buttons["cancel"].hide();
            buttons["yes"].hide();
            buttons["no"].hide();
            return width;
        }
        dlg.footer.dom.style.display = '';
        for(var k in buttons){
            if(typeof buttons[k] != "function"){
                if(b[k]){
                    buttons[k].show();
                    buttons[k].setText(typeof b[k] == "string" ? b[k] : Wtf.MessageBox.buttonText[k]);
                    width += buttons[k].el.getWidth()+15;
                }else{
                    buttons[k].hide();
                }
            }
        }
        return width;
    };

    return {
        
        getDialog : function(titleText){
           if(!dlg){
                dlg = new Wtf.Window({
                    autoCreate : true,
                    title:titleText,
                    resizable:false,
                    constrain:true,
                    constrainHeader:true,
                    minimizable : false,
                    maximizable : false,
                    stateful: false,
                    modal: true,
                    shim:true,
                    buttonAlign:"center",
                    width:400,
                    height:100,
                    minHeight: 80,
                    plain:true,
                    footer:true,
                    closable:true,
                    close : function(){
                        if(opt && opt.buttons && opt.buttons.no && !opt.buttons.cancel){
                            handleButton("no");
                        }else{
                            handleButton("cancel");
                        }
                    }
                });
                buttons = {};
                var bt = this.buttonText;
                
                buttons["ok"] = dlg.addButton(bt["ok"], handleButton.createCallback("ok"));
                buttons["yes"] = dlg.addButton(bt["yes"], handleButton.createCallback("yes"));
                buttons["no"] = dlg.addButton(bt["no"], handleButton.createCallback("no"));
                buttons["cancel"] = dlg.addButton(bt["cancel"], handleButton.createCallback("cancel"));
                buttons["ok"].hideMode = buttons["yes"].hideMode = buttons["no"].hideMode = buttons["cancel"].hideMode = 'offsets';
                dlg.render(document.body);
                dlg.getEl().addClass('x-window-dlg');
                mask = dlg.mask;
                bodyEl = dlg.body.createChild({
                    html:'<div class="wtf-mb-icon"></div><div class="wtf-mb-content"><span class="wtf-mb-text"></span><br /><input type="text" class="wtf-mb-input" /><textarea class="wtf-mb-textarea"></textarea></div>'
                });
                iconEl = Wtf.get(bodyEl.dom.firstChild);
                var contentEl = bodyEl.dom.childNodes[1];
                msgEl = Wtf.get(contentEl.firstChild);
                textboxEl = Wtf.get(contentEl.childNodes[2]);
                textboxEl.enableDisplayMode();
                textboxEl.addKeyListener([10,13], function(){
                    if(dlg.isVisible() && opt && opt.buttons){
                        if(opt.buttons.ok){
                            handleButton("ok");
                        }else if(opt.buttons.yes){
                            handleButton("yes");
                        }
                    }
                });
                textareaEl = Wtf.get(contentEl.childNodes[3]);
                textareaEl.enableDisplayMode();
                progressBar = new Wtf.ProgressBar({
                    renderTo:bodyEl
                });
               bodyEl.createChild({cls:'x-clear'});
            }
            return dlg;
        },

        
        updateText : function(text){
            if(!dlg.isVisible() && !opt.width){
                dlg.setSize(this.maxWidth, 100); 
            }
            msgEl.update(text || '&#160;');

            var iw = iconCls != '' ? (iconEl.getWidth() + iconEl.getMargins('lr')) : 0;
            var mw = msgEl.getWidth() + msgEl.getMargins('lr');
            var fw = dlg.getFrameWidth('lr');
            var bw = dlg.body.getFrameWidth('lr');
            if (Wtf.isIE && iw > 0){
                
                
                iw += 3;
            }
            var w = Math.max(Math.min(opt.width || iw+mw+fw+bw, this.maxWidth),
                        Math.max(opt.minWidth || this.minWidth, bwidth || 0));

            if(opt.prompt === true){
                activeTextEl.setWidth(w-iw-fw-bw);
            }
            if(opt.progress === true || opt.wait === true){
                progressBar.setSize(w-iw-fw-bw);
            }
            dlg.setSize(w, 'auto').center();
            return this;
        },

        
        updateProgress : function(value, progressText, msg){
            progressBar.updateProgress(value, progressText);
            if(msg){
                this.updateText(msg);
            }
            return this;
        },

        
        isVisible : function(){
            return dlg && dlg.isVisible();
        },

        
        hide : function(){
            if(this.isVisible()){
                dlg.hide();
                handleHide();
            }
            return this;
        },

        
        show : function(options){
            if(this.isVisible()){
                this.hide();
            }
            opt = options;
            var d = this.getDialog(opt.title || "&#160;");

            d.setTitle(opt.title || "&#160;");
            var allowClose = (opt.closable !== false && opt.progress !== true && opt.wait !== true);
            d.tools.close.setDisplayed(allowClose);
            activeTextEl = textboxEl;
            opt.prompt = opt.prompt || (opt.multiline ? true : false);
            if(opt.prompt){
                if(opt.multiline){
                    textboxEl.hide();
                    textareaEl.show();
                    textareaEl.setHeight(typeof opt.multiline == "number" ?
                        opt.multiline : this.defaultTextHeight);
                    activeTextEl = textareaEl;
                }else{
                    textboxEl.show();
                    textareaEl.hide();
                }
            }else{
                textboxEl.hide();
                textareaEl.hide();
            }
            activeTextEl.dom.value = opt.value || "";
            if(opt.prompt){
                d.focusEl = activeTextEl;
            }else{
                var bs = opt.buttons;
                var db = null;
                if(bs && bs.ok){
                    db = buttons["ok"];
                }else if(bs && bs.yes){
                    db = buttons["yes"];
                }
                if (db){
                    d.focusEl = db;
                }
            }
            this.setIcon(opt.icon);
            bwidth = updateButtons(opt.buttons);
            progressBar.setVisible(opt.progress === true || opt.wait === true);
            this.updateProgress(0, opt.progressText);
            this.updateText(opt.msg);
            if(opt.cls){
                d.el.addClass(opt.cls);
            }
            d.proxyDrag = opt.proxyDrag === true;
            d.modal = opt.modal !== false;
            d.mask = opt.modal !== false ? mask : false;
            if(!d.isVisible()){
                
                document.body.appendChild(dlg.el.dom);
                d.setAnimateTarget(opt.animEl);
                d.show(opt.animEl);
            }

            
            d.on('show', function(){
                if(allowClose === true){
                    d.keyMap.enable();
                }else{
                    d.keyMap.disable();
                }
            });

            if(opt.wait === true){
                progressBar.wait(opt.waitConfig);
            }
            return this;
        },

        
        setIcon : function(icon){
            if(icon && icon != ''){
                iconEl.removeClass('x-hidden');
                iconEl.replaceClass(iconCls, icon);
                iconCls = icon;
            }else{
                iconEl.replaceClass(iconCls, 'x-hidden');
                iconCls = '';
            }
            return this;
        },

        
        progress : function(title, msg, progressText){
            this.show({
                title : title,
                msg : msg,
                buttons: false,
                progress:true,
                closable:false,
                minWidth: this.minProgressWidth,
                progressText: progressText
            });
            return this;
        },

        
        wait : function(msg, title, config){
            this.show({
                title : title,
                msg : msg,
                buttons: false,
                closable:false,
                wait:true,
                modal:true,
                minWidth: this.minProgressWidth,
                waitConfig: config
            });
            return this;
        },

        
        alert : function(title, msg, fn, scope){
            this.show({
                title : title,
                msg : msg,
                buttons: this.OK,
                fn: fn,
                scope : scope
            });
            return this;
        },

        
        confirm : function(title, msg, fn, scope){
            this.show({
                title : title,
                msg : msg,
                buttons: this.YESNO,
                fn: fn,
                scope : scope,
                icon: this.QUESTION
            });
            return this;
        },

        
        prompt : function(title, msg, fn, scope, multiline){
            this.show({
                title : title,
                msg : msg,
                buttons: this.OKCANCEL,
                fn: fn,
                minWidth:250,
                scope : scope,
                prompt:true,
                multiline: multiline
            });
            return this;
        },

        
        OK : {ok:true},
        
        CANCEL : {cancel:true},
        
        OKCANCEL : {ok:true, cancel:true},
        
        YESNO : {yes:true, no:true},
        
        YESNOCANCEL : {yes:true, no:true, cancel:true},
        
        INFO : 'wtf-mb-info',
        
        WARNING : 'wtf-mb-warning',
        
        QUESTION : 'wtf-mb-question',
        
        ERROR : 'wtf-mb-error',

        
        defaultTextHeight : 75,
        
        maxWidth : 600,
        
        minWidth : 100,
        
        minProgressWidth : 250,
        
        buttonText : {
            ok : "OK",
            cancel : "Cancel",
            yes : "Yes",
            no : "No"
        }
    };
}();


Wtf.Msg = Wtf.MessageBox;

Wtf.Tip = Wtf.extend(Wtf.Panel, {
    
    
    minWidth : 40,
    
    maxWidth : 300,
    
    shadow : "sides",
    
    defaultAlign : "tl-bl?",
    autoRender: true,
    quickShowInterval : 250,

    
    frame:true,
    hidden:true,
    baseCls: 'x-tip',
    floating:{shadow:true,shim:true,useDisplay:true,constrain:false},
    autoHeight:true,

    
    initComponent : function(){
        Wtf.Tip.superclass.initComponent.call(this);
        if(this.closable && !this.title){
            this.elements += ',header';
        }
    },

    
    afterRender : function(){
        Wtf.Tip.superclass.afterRender.call(this);
        if(this.closable){
            this.addTool({
                id: 'close',
                handler: this.hide,
                scope: this
            });
        }
    },

    
    showAt : function(xy){
        Wtf.Tip.superclass.show.call(this);
        if(this.measureWidth !== false && (!this.initialConfig || typeof this.initialConfig.width != 'number')){
            var bw = this.body.getTextWidth();
            if(this.title){
                bw = Math.max(bw, this.header.child('span').getTextWidth(this.title));
            }
            bw += this.getFrameWidth() + (this.closable ? 20 : 0) + this.body.getPadding("lr");
            this.setWidth(bw.constrain(this.minWidth, this.maxWidth));
        }
        if(this.constrainPosition){
            xy = this.el.adjustForConstraints(xy);
        }
        this.setPagePosition(xy[0], xy[1]);
    },

    
    showBy : function(el, pos){
        if(!this.rendered){
            this.render(Wtf.getBody());
        }
        this.showAt(this.el.getAlignToXY(el, pos || this.defaultAlign));
    },

    initDraggable : function(){
        this.dd = new Wtf.Tip.DD(this, typeof this.draggable == 'boolean' ? null : this.draggable);
        this.header.addClass('x-tip-draggable');
    }
});


Wtf.Tip.DD = function(tip, config){
    Wtf.apply(this, config);
    this.tip = tip;
    Wtf.Tip.DD.superclass.constructor.call(this, tip.el.id, 'WindowDD-'+tip.id);
    this.setHandleElId(tip.header.id);
    this.scroll = false;
};

Wtf.extend(Wtf.Tip.DD, Wtf.dd.DD, {
    moveOnly:true,
    scroll:false,
    headerOffsets:[100, 25],
    startDrag : function(){
        this.tip.el.disableShadow();
    },
    endDrag : function(e){
        this.tip.el.enableShadow(true);
    }
});

Wtf.ToolTip = Wtf.extend(Wtf.Tip, {
    
    
    
    showDelay: 500,
    
    hideDelay: 200,
    
    dismissDelay: 5000,
    
    mouseOffset: [15,18],
    
    trackMouse : false,
    constrainPosition: true,

    
    initComponent: function(){
        Wtf.ToolTip.superclass.initComponent.call(this);
        this.lastActive = new Date();
        this.initTarget();
    },

    
    initTarget : function(){
        if(this.target){
            this.target = Wtf.get(this.target);
            this.target.on('mouseover', this.onTargetOver, this);
            this.target.on('mouseout', this.onTargetOut, this);
            this.target.on('mousemove', this.onMouseMove, this);
        }
    },

    
    onMouseMove : function(e){
        this.targetXY = e.getXY();
        if(!this.hidden && this.trackMouse){
            this.setPagePosition(this.getTargetXY());
        }
    },

    
    getTargetXY : function(){
        return [this.targetXY[0]+this.mouseOffset[0], this.targetXY[1]+this.mouseOffset[1]];
    },

    
    onTargetOver : function(e){
        if(this.disabled || e.within(this.target.dom, true)){
            return;
        }
        this.clearTimer('hide');
        this.targetXY = e.getXY();
        this.delayShow();
    },

    
    delayShow : function(){
        if(this.hidden && !this.showTimer){
            if(this.lastActive.getElapsed() < this.quickShowInterval){
                this.show();
            }else{
                this.showTimer = this.show.defer(this.showDelay, this);
            }
        }else if(!this.hidden && this.autoHide !== false){
            this.show();
        }
    },

    
    onTargetOut : function(e){
        if(this.disabled || e.within(this.target.dom, true)){
            return;
        }
        this.clearTimer('show');
        if(this.autoHide !== false){
            this.delayHide();
        }
    },

    
    delayHide : function(){
        if(!this.hidden && !this.hideTimer){
            this.hideTimer = this.hide.defer(this.hideDelay, this);
        }
    },

    
    hide: function(){
        this.clearTimer('dismiss');
        this.lastActive = new Date();
        Wtf.ToolTip.superclass.hide.call(this);
    },

    
    show : function(){
        this.showAt(this.getTargetXY());
    },

    
    showAt : function(xy){
        this.lastActive = new Date();
        this.clearTimers();
        Wtf.ToolTip.superclass.showAt.call(this, xy);
        if(this.dismissDelay && this.autoHide !== false){
            this.dismissTimer = this.hide.defer(this.dismissDelay, this);
        }
    },

    
    clearTimer : function(name){
        name = name + 'Timer';
        clearTimeout(this[name]);
        delete this[name];
    },

    
    clearTimers : function(){
        this.clearTimer('show');
        this.clearTimer('dismiss');
        this.clearTimer('hide');
    },

    
    onShow : function(){
        Wtf.ToolTip.superclass.onShow.call(this);
        Wtf.getDoc().on('mousedown', this.onDocMouseDown, this);
    },

    
    onHide : function(){
        Wtf.ToolTip.superclass.onHide.call(this);
        Wtf.getDoc().un('mousedown', this.onDocMouseDown, this);
    },

    
    onDocMouseDown : function(e){
        if(this.autoHide !== false && !e.within(this.el.dom)){
            this.disable();
            this.enable.defer(100, this);
        }
    },

    
    onDisable : function(){
        this.clearTimers();
        this.hide();
    },

    
    adjustPosition : function(x, y){
        
        var ay = this.targetXY[1], h = this.getSize().height;
        if(this.constrainPosition && y <= ay && (y+h) >= ay){
            y = ay-h-5;
        }
        return {x : x, y: y};
    },

    
    onDestroy : function(){
        Wtf.ToolTip.superclass.onDestroy.call(this);
        if(this.target){
            this.target.un('mouseover', this.onTargetOver, this);
            this.target.un('mouseout', this.onTargetOut, this);
            this.target.un('mousemove', this.onMouseMove, this);
        }
    }
});

Wtf.QuickTip = Wtf.extend(Wtf.ToolTip, {
    
    
    interceptTitles : false,

    
    tagConfig : {
        namespace : "wtf",
        attribute : "qtip",
        width : "qwidth",
        target : "target",
        title : "qtitle",
        hide : "hide",
        cls : "qclass",
        align : "qalign"
    },

    
    initComponent : function(){
        this.target = this.target || Wtf.getDoc();
        this.targets = this.targets || {};
        Wtf.QuickTip.superclass.initComponent.call(this);
    },

    
    register : function(config){
        var cs = config instanceof Array ? config : arguments;
        for(var i = 0, len = cs.length; i < len; i++){
            var c = cs[i];
            var target = c.target;
            if(target){
                if(target instanceof Array){
                    for(var j = 0, jlen = target.length; j < jlen; j++){
                        this.targets[Wtf.id(target[j])] = c;
                    }
                } else{
                    this.targets[Wtf.id(target)] = c;
                }
            }
        }
    },

    
    unregister : function(el){
        delete this.targets[Wtf.id(el)];
    },

    
    onTargetOver : function(e){
        if(this.disabled){
            return;
        }
        this.targetXY = e.getXY();
        var t = e.getTarget();
        if(!t || t.nodeType !== 1 || t == document || t == document.body){
            return;
        }
        if(this.activeTarget && t == this.activeTarget.el){
            this.clearTimer('hide');
            this.show();
            return;
        }
        if(t && this.targets[t.id]){
            this.activeTarget = this.targets[t.id];
            this.activeTarget.el = t;
            this.delayShow();
            return;
        }
        var ttp, et = Wtf.fly(t), cfg = this.tagConfig;
        var ns = cfg.namespace;
        if(this.interceptTitles && t.title){
            ttp = t.title;
            t.qtip = ttp;
            t.removeAttribute("title");
            e.preventDefault();
        } else{
            ttp = t.qtip || et.getAttributeNS(ns, cfg.attribute);
        }
        if(ttp){
            var autoHide = et.getAttributeNS(ns, cfg.hide);
            this.activeTarget = {
                el: t,
                text: ttp,
                width: et.getAttributeNS(ns, cfg.width),
                autoHide: autoHide != "user" && autoHide !== 'false',
                title: et.getAttributeNS(ns, cfg.title),
                cls: et.getAttributeNS(ns, cfg.cls),
                align: et.getAttributeNS(ns, cfg.align)
            };
            this.delayShow();
        }
    },

    
    onTargetOut : function(e){
        this.clearTimer('show');
        if(this.autoHide !== false){
            this.delayHide();
        }
    },

    
    showAt : function(xy){
        var t = this.activeTarget;
        if(t){
            if(!this.rendered){
                this.render(Wtf.getBody());
            }
            if(t.width){
                this.setWidth(t.width);
                this.measureWidth = false;
            } else{
                this.measureWidth = true;
            }
            this.setTitle(t.title || '');
            this.body.update(t.text);
            this.autoHide = t.autoHide;
            this.dismissDelay = t.dismissDelay || this.dismissDelay;
            if(this.lastCls){
                this.el.removeClass(this.lastCls);
                delete this.lastCls;
            }
            if(t.cls){
                this.el.addClass(t.cls);
                this.lastCls = t.cls;
            }
            if(t.align){ 
                xy = this.el.getAlignToXY(t.el, t.align);
                this.constrainPosition = false;
            } else{
                this.constrainPosition = true;
            }
        }
        Wtf.QuickTip.superclass.showAt.call(this, xy);
    },

    
    hide: function(){
        delete this.activeTarget;
        Wtf.QuickTip.superclass.hide.call(this);
    }
});

Wtf.QuickTips = function(){
    var tip, locks = [];
    return {
        
        init : function(){
            if(!tip){
                tip = new Wtf.QuickTip({elements:'header,body'});
            }
        },

        
        enable : function(){
            if(tip){
                locks.pop();
                if(locks.length < 1){
                    tip.enable();
                }
            }
        },

        
        disable : function(){
            if(tip){
                tip.disable();
            }
            locks.push(1);
        },

        
        isEnabled : function(){
            return tip && !tip.disabled;
        },

        
        getQuickTip : function(){
            return tip;
        },

        
        register : function(){
            tip.register.apply(tip, arguments);
        },

        
        unregister : function(){
            tip.unregister.apply(tip, arguments);
        },

        
        tips :function(){
            tip.register.apply(tip, arguments);
        }
    }
}();

Wtf.tree.TreePanel = Wtf.extend(Wtf.Panel, {
    rootVisible : true,
    animate: Wtf.enableFx,
    lines : true,
    enableDD : false,
    hlDrop : Wtf.enableFx,
    pathSeparator: "/",

    initComponent : function(){
        Wtf.tree.TreePanel.superclass.initComponent.call(this);

        if(!this.eventModel){
            this.eventModel = new Wtf.tree.TreeEventModel(this);
        }
        
        this.nodeHash = {};

        
        if(this.root){
           this.setRootNode(this.root);
        }

        this.addEvents(

            
           "append",
           
           "remove",
           
           "movenode",
           
           "insert",
           
           "beforeappend",
           
           "beforeremove",
           
           "beforemovenode",
           
            "beforeinsert",

            
            "beforeload",
            
            "load",
            
            "textchange",
            
            "beforeexpandnode",
            
            "beforecollapsenode",
            
            "expandnode",
            
            "disabledchange",
            
            "collapsenode",
            
            "beforeclick",
            
            "click",
            
            "checkchange",
            
            "dblclick",
            
            "contextmenu",
            
            "beforechildrenrendered",
           
            "startdrag",
            
            "enddrag",
            
            "dragdrop",
            
            "beforenodedrop",
            
            "nodedrop",
             
            "nodedragover"
        );
        if(this.singleExpand){
            this.on("beforeexpandnode", this.restrictExpand, this);
        }
    },

    
    proxyNodeEvent : function(ename, a1, a2, a3, a4, a5, a6){
        if(ename == 'collapse' || ename == 'expand' || ename == 'beforecollapse' || ename == 'beforeexpand' || ename == 'move' || ename == 'beforemove'){
            ename = ename+'node';
        }
        
        return this.fireEvent(ename, a1, a2, a3, a4, a5, a6);
    },


    
    getRootNode : function(){
        return this.root;
    },

    
    setRootNode : function(node){
        this.root = node;
        node.ownerTree = this;
        node.isRoot = true;
        this.registerNode(node);
        if(!this.rootVisible){
        	var uiP = node.attributes.uiProvider;
        	node.ui = uiP ? new uiP(node) : new Wtf.tree.RootTreeNodeUI(node); 
        }
        return node;
    },

    
    getNodeById : function(id){
        return this.nodeHash[id];
    },

    
    registerNode : function(node){
        this.nodeHash[node.id] = node;
    },

    
    unregisterNode : function(node){
        delete this.nodeHash[node.id];
    },

    
    toString : function(){
        return "[Tree"+(this.id?" "+this.id:"")+"]";
    },

    
    restrictExpand : function(node){
        var p = node.parentNode;
        if(p){
            if(p.expandedChild && p.expandedChild.parentNode == p){
                p.expandedChild.collapse();
            }
            p.expandedChild = node;
        }
    },

    
    getChecked : function(a, startNode){
        startNode = startNode || this.root;
        var r = [];
        var f = function(){
            if(this.attributes.checked){
                r.push(!a ? this : (a == 'id' ? this.id : this.attributes[a]));
            }
        }
        startNode.cascade(f);
        return r;
    },

    
    getEl : function(){
        return this.el;
    },

    
    getLoader : function(){
        return this.loader;
    },

    
    expandAll : function(){
        this.root.expand(true);
    },

    
    collapseAll : function(){
        this.root.collapse(true);
    },

    
    getSelectionModel : function(){
        if(!this.selModel){
            this.selModel = new Wtf.tree.DefaultSelectionModel();
        }
        return this.selModel;
    },

    
    expandPath : function(path, attr, callback){
        attr = attr || "id";
        var keys = path.split(this.pathSeparator);
        var curNode = this.root;
        if(curNode.attributes[attr] != keys[1]){ 
            if(callback){
                callback(false, null);
            }
            return;
        }
        var index = 1;
        var f = function(){
            if(++index == keys.length){
                if(callback){
                    callback(true, curNode);
                }
                return;
            }
            var c = curNode.findChild(attr, keys[index]);
            if(!c){
                if(callback){
                    callback(false, curNode);
                }
                return;
            }
            curNode = c;
            c.expand(false, false, f);
        };
        curNode.expand(false, false, f);
    },

    
    selectPath : function(path, attr, callback){
        attr = attr || "id";
        var keys = path.split(this.pathSeparator);
        var v = keys.pop();
        if(keys.length > 0){
            var f = function(success, node){
                if(success && node){
                    var n = node.findChild(attr, v);
                    if(n){
                        n.select();
                        if(callback){
                            callback(true, n);
                        }
                    }else if(callback){
                        callback(false, n);
                    }
                }else{
                    if(callback){
                        callback(false, n);
                    }
                }
            };
            this.expandPath(keys.join(this.pathSeparator), attr, f);
        }else{
            this.root.select();
            if(callback){
                callback(true, this.root);
            }
        }
    },

    
    getTreeEl : function(){
        return this.body;
    },

    
    onRender : function(ct, position){
        Wtf.tree.TreePanel.superclass.onRender.call(this, ct, position);
        this.el.addClass('x-tree');
        this.innerCt = this.body.createChild({tag:"ul",
               cls:"x-tree-root-ct " +
               (this.lines ? "x-tree-lines" : "x-tree-no-lines")});
    },

    
    initEvents : function(){
        Wtf.tree.TreePanel.superclass.initEvents.call(this);

        if(this.containerScroll){
            Wtf.dd.ScrollManager.register(this.body);
        }
        if((this.enableDD || this.enableDrop) && !this.dropZone){
           
             this.dropZone = new Wtf.tree.TreeDropZone(this, this.dropConfig || {
               ddGroup: this.ddGroup || "TreeDD", appendOnly: this.ddAppendOnly === true
           });
        }
        if((this.enableDD || this.enableDrag) && !this.dragZone){
           
            this.dragZone = new Wtf.tree.TreeDragZone(this, this.dragConfig || {
               ddGroup: this.ddGroup || "TreeDD",
               scroll: this.ddScroll
           });
        }
        this.getSelectionModel().init(this);
    },

    
    afterRender : function(){
        Wtf.tree.TreePanel.superclass.afterRender.call(this);
        this.root.render();
        if(!this.rootVisible){
            this.root.renderChildren();
        }
    },

    onDestroy : function(){
        if(this.rendered){
            this.body.removeAllListeners();
            Wtf.dd.ScrollManager.unregister(this.body);
            if(this.dropZone){
                this.dropZone.unreg();
            }
            if(this.dragZone){
               this.dragZone.unreg();
            }
        }
        this.root.destroy();
        this.nodeHash = null;
        Wtf.tree.TreePanel.superclass.onDestroy.call(this);
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
});
Wtf.reg('treepanel', Wtf.tree.TreePanel);
Wtf.tree.TreeEventModel = function(tree){
    this.tree = tree;
    this.tree.on('render', this.initEvents, this);
}

Wtf.tree.TreeEventModel.prototype = {
    initEvents : function(){
        var el = this.tree.getTreeEl();
        el.on('click', this.delegateClick, this);
        el.on('mouseover', this.delegateOver, this);
        el.on('mouseout', this.delegateOut, this);
        el.on('dblclick', this.delegateDblClick, this);
        el.on('contextmenu', this.delegateContextMenu, this);
    },

    getNode : function(e){
        var t;
        if(t = e.getTarget('.x-tree-node-el', 10)){
            var id = Wtf.fly(t, '_treeEvents').getAttributeNS('wtf', 'tree-node-id');
            if(id){
                return this.tree.getNodeById(id);
            }
        }
        return null;
    },

    getNodeTarget : function(e){
        var t = e.getTarget('.x-tree-node-icon', 1);
        if(!t){
            t = e.getTarget('.x-tree-node-el', 6);
        }
        return t;
    },

    delegateOut : function(e, t){
        if(!this.beforeEvent(e)){
            return;
        }
        t = this.getNodeTarget(e);
        if(t && !e.within(t, true)){
            this.onNodeOut(e, this.getNode(e));
        }
    },

    delegateOver : function(e, t){
        if(!this.beforeEvent(e)){
            return;
        }
        t = this.getNodeTarget(e);
        if(t){
            this.onNodeOver(e, this.getNode(e));
        }
    },

    delegateClick : function(e, t){
        if(!this.beforeEvent(e)){
            return;
        }

        if(e.getTarget('input[type=checkbox]', 1)){
            this.onCheckboxClick(e, this.getNode(e));
        }
        else if(e.getTarget('.x-tree-ec-icon', 1)){
            this.onIconClick(e, this.getNode(e));
        }
        else if(this.getNodeTarget(e)){
            this.onNodeClick(e, this.getNode(e));
        }
    },

    delegateDblClick : function(e, t){
        if(this.beforeEvent(e) && this.getNodeTarget(e)){
            this.onNodeDblClick(e, this.getNode(e));
        }
    },

    delegateContextMenu : function(e, t){
        if(this.beforeEvent(e) && this.getNodeTarget(e)){
            this.onNodeContextMenu(e, this.getNode(e));
        }
    },

    onNodeClick : function(e, node){
        node.ui.onClick(e);
    },

    onNodeOver : function(e, node){
        node.ui.onOver(e);
    },

    onNodeOut : function(e, node){
        node.ui.onOut(e);
    },

    onIconClick : function(e, node){
        node.ui.ecClick(e);
    },

    onCheckboxClick : function(e, node){
        node.ui.onCheckChange(e);
    },

    onNodeDblClick : function(e, node){
        node.ui.onDblClick(e);
    },

    onNodeContextMenu : function(e, node){
        node.ui.onContextMenu(e);
    },

    beforeEvent : function(e){
        if(this.disabled){
            e.stopEvent();
            return false;
        }
        return true;
    },

    disable: function(){
        this.disabled = true;
    },

    enable: function(){
        this.disabled = false;
    }
};

Wtf.tree.DefaultSelectionModel = function(config){
   this.selNode = null;
   
   this.addEvents(
       
       "selectionchange",

       
       "beforeselect"
   );

    Wtf.apply(this, config);
    Wtf.tree.DefaultSelectionModel.superclass.constructor.call(this);
};

Wtf.extend(Wtf.tree.DefaultSelectionModel, Wtf.util.Observable, {
    init : function(tree){
        this.tree = tree;
        tree.getTreeEl().on("keydown", this.onKeyDown, this);
        tree.on("click", this.onNodeClick, this);
    },
    
    onNodeClick : function(node, e){
        this.select(node);
    },
    
    
    select : function(node){
        var last = this.selNode;
        if(last != node && this.fireEvent('beforeselect', this, node, last) !== false){
            if(last){
                last.ui.onSelectedChange(false);
            }
            this.selNode = node;
            node.ui.onSelectedChange(true);
            this.fireEvent("selectionchange", this, node, last);
        }
        return node;
    },
    
    
    unselect : function(node){
        if(this.selNode == node){
            this.clearSelections();
        }    
    },
    
    
    clearSelections : function(){
        var n = this.selNode;
        if(n){
            n.ui.onSelectedChange(false);
            this.selNode = null;
            this.fireEvent("selectionchange", this, null);
        }
        return n;
    },
    
    
    getSelectedNode : function(){
        return this.selNode;    
    },
    
    
    isSelected : function(node){
        return this.selNode == node;  
    },

    
    selectPrevious : function(){
        var s = this.selNode || this.lastSelNode;
        if(!s){
            return null;
        }
        var ps = s.previousSibling;
        if(ps){
            if(!ps.isExpanded() || ps.childNodes.length < 1){
                return this.select(ps);
            } else{
                var lc = ps.lastChild;
                while(lc && lc.isExpanded() && lc.childNodes.length > 0){
                    lc = lc.lastChild;
                }
                return this.select(lc);
            }
        } else if(s.parentNode && (this.tree.rootVisible || !s.parentNode.isRoot)){
            return this.select(s.parentNode);
        }
        return null;
    },

    
    selectNext : function(){
        var s = this.selNode || this.lastSelNode;
        if(!s){
            return null;
        }
        if(s.firstChild && s.isExpanded()){
             return this.select(s.firstChild);
         }else if(s.nextSibling){
             return this.select(s.nextSibling);
         }else if(s.parentNode){
            var newS = null;
            s.parentNode.bubble(function(){
                if(this.nextSibling){
                    newS = this.getOwnerTree().selModel.select(this.nextSibling);
                    return false;
                }
            });
            return newS;
         }
        return null;
    },

    onKeyDown : function(e){
        var s = this.selNode || this.lastSelNode;
        
        var sm = this;
        if(!s){
            return;
        }
        var k = e.getKey();
        switch(k){
             case e.DOWN:
                 e.stopEvent();
                 this.selectNext();
             break;
             case e.UP:
                 e.stopEvent();
                 this.selectPrevious();
             break;
             case e.RIGHT:
                 e.preventDefault();
                 if(s.hasChildNodes()){
                     if(!s.isExpanded()){
                         s.expand();
                     }else if(s.firstChild){
                         this.select(s.firstChild, e);
                     }
                 }
             break;
             case e.LEFT:
                 e.preventDefault();
                 if(s.hasChildNodes() && s.isExpanded()){
                     s.collapse();
                 }else if(s.parentNode && (this.tree.rootVisible || s.parentNode != this.tree.getRootNode())){
                     this.select(s.parentNode, e);
                 }
             break;
        };
    }
});


Wtf.tree.MultiSelectionModel = function(config){
   this.selNodes = [];
   this.selMap = {};
   this.addEvents(
       
       "selectionchange"
   );
    Wtf.apply(this, config);
    Wtf.tree.MultiSelectionModel.superclass.constructor.call(this);
};

Wtf.extend(Wtf.tree.MultiSelectionModel, Wtf.util.Observable, {
    init : function(tree){
        this.tree = tree;
        tree.getTreeEl().on("keydown", this.onKeyDown, this);
        tree.on("click", this.onNodeClick, this);
    },
    
    onNodeClick : function(node, e){
        this.select(node, e, e.ctrlKey);
    },
    
    
    select : function(node, e, keepExisting){
        if(keepExisting !== true){
            this.clearSelections(true);
        }
        if(this.isSelected(node)){
            this.lastSelNode = node;
            return node;
        }
        this.selNodes.push(node);
        this.selMap[node.id] = node;
        this.lastSelNode = node;
        node.ui.onSelectedChange(true);
        this.fireEvent("selectionchange", this, this.selNodes);
        return node;
    },
    
    
    unselect : function(node){
        if(this.selMap[node.id]){
            node.ui.onSelectedChange(false);
            var sn = this.selNodes;
            var index = sn.indexOf(node);
            if(index != -1){
                this.selNodes.splice(index, 1);
            }
            delete this.selMap[node.id];
            this.fireEvent("selectionchange", this, this.selNodes);
        }
    },
    
    
    clearSelections : function(suppressEvent){
        var sn = this.selNodes;
        if(sn.length > 0){
            for(var i = 0, len = sn.length; i < len; i++){
                sn[i].ui.onSelectedChange(false);
            }
            this.selNodes = [];
            this.selMap = {};
            if(suppressEvent !== true){
                this.fireEvent("selectionchange", this, this.selNodes);
            }
        }
    },
    
    
    isSelected : function(node){
        return this.selMap[node.id] ? true : false;  
    },
    
    
    getSelectedNodes : function(){
        return this.selNodes;    
    },

    onKeyDown : Wtf.tree.DefaultSelectionModel.prototype.onKeyDown,

    selectNext : Wtf.tree.DefaultSelectionModel.prototype.selectNext,

    selectPrevious : Wtf.tree.DefaultSelectionModel.prototype.selectPrevious
});

Wtf.tree.TreeNode = function(attributes){
    attributes = attributes || {};
    if(typeof attributes == "string"){
        attributes = {text: attributes};
    }
    this.childrenRendered = false;
    this.rendered = false;
    Wtf.tree.TreeNode.superclass.constructor.call(this, attributes);
    this.expanded = attributes.expanded === true;
    this.isTarget = attributes.isTarget !== false;
    this.draggable = attributes.draggable !== false && attributes.allowDrag !== false;
    this.allowChildren = attributes.allowChildren !== false && attributes.allowDrop !== false;

    
    this.text = attributes.text;
    
    this.disabled = attributes.disabled === true;

    this.addEvents(
        
        "textchange",
        
        "beforeexpand",
        
        "beforecollapse",
        
        "expand",
        
        "disabledchange",
        
        "collapse",
        
        "beforeclick",
        
        "click",
        
        "checkchange",
        
        "dblclick",
        
        "contextmenu",
        
        "beforechildrenrendered"
    );

    var uiClass = this.attributes.uiProvider || this.defaultUI || Wtf.tree.TreeNodeUI;

    
    this.ui = new uiClass(this);
};
Wtf.extend(Wtf.tree.TreeNode, Wtf.data.Node, {
    preventHScroll: true,
    
    isExpanded : function(){
        return this.expanded;
    },


    getUI : function(){
        return this.ui;
    },

    
    setFirstChild : function(node){
        var of = this.firstChild;
        Wtf.tree.TreeNode.superclass.setFirstChild.call(this, node);
        if(this.childrenRendered && of && node != of){
            of.renderIndent(true, true);
        }
        if(this.rendered){
            this.renderIndent(true, true);
        }
    },

    
    setLastChild : function(node){
        var ol = this.lastChild;
        Wtf.tree.TreeNode.superclass.setLastChild.call(this, node);
        if(this.childrenRendered && ol && node != ol){
            ol.renderIndent(true, true);
        }
        if(this.rendered){
            this.renderIndent(true, true);
        }
    },

    
    
    appendChild : function(){
        var node = Wtf.tree.TreeNode.superclass.appendChild.apply(this, arguments);
        if(node && this.childrenRendered){
            node.render();
        }
        this.ui.updateExpandIcon();
        return node;
    },

    
    removeChild : function(node){
        this.ownerTree.getSelectionModel().unselect(node);
        Wtf.tree.TreeNode.superclass.removeChild.apply(this, arguments);
        
        if(this.childrenRendered){
            node.ui.remove();
        }
        if(this.childNodes.length < 1){
            this.collapse(false, false);
        }else{
            this.ui.updateExpandIcon();
        }
        if(!this.firstChild && !this.isHiddenRoot()) {
            this.childrenRendered = false;
        }
        return node;
    },

    
    insertBefore : function(node, refNode){
        var newNode = Wtf.tree.TreeNode.superclass.insertBefore.apply(this, arguments);
        if(newNode && refNode && this.childrenRendered){
            node.render();
        }
        this.ui.updateExpandIcon();
        return newNode;
    },

    
    setText : function(text){
        var oldText = this.text;
        this.text = text;
        this.attributes.text = text;
        if(this.rendered){ 
            this.ui.onTextChange(this, text, oldText);
        }
        this.fireEvent("textchange", this, text, oldText);
    },

    
    select : function(){
        this.getOwnerTree().getSelectionModel().select(this);
    },

    
    unselect : function(){
        this.getOwnerTree().getSelectionModel().unselect(this);
    },

    
    isSelected : function(){
        return this.getOwnerTree().getSelectionModel().isSelected(this);
    },

    
    expand : function(deep, anim, callback){
        if(!this.expanded){
            if(this.fireEvent("beforeexpand", this, deep, anim) === false){
                return;
            }
            if(!this.childrenRendered){
                this.renderChildren();
            }
            this.expanded = true;
            if(!this.isHiddenRoot() && (this.getOwnerTree().animate && anim !== false) || anim){
                this.ui.animExpand(function(){
                    this.fireEvent("expand", this);
                    if(typeof callback == "function"){
                        callback(this);
                    }
                    if(deep === true){
                        this.expandChildNodes(true);
                    }
                }.createDelegate(this));
                return;
            }else{
                this.ui.expand();
                this.fireEvent("expand", this);
                if(typeof callback == "function"){
                    callback(this);
                }
            }
        }else{
           if(typeof callback == "function"){
               callback(this);
           }
        }
        if(deep === true){
            this.expandChildNodes(true);
        }
    },

    isHiddenRoot : function(){
        return this.isRoot && !this.getOwnerTree().rootVisible;
    },

    
    collapse : function(deep, anim){
        if(this.expanded && !this.isHiddenRoot()){
            if(this.fireEvent("beforecollapse", this, deep, anim) === false){
                return;
            }
            this.expanded = false;
            if((this.getOwnerTree().animate && anim !== false) || anim){
                this.ui.animCollapse(function(){
                    this.fireEvent("collapse", this);
                    if(deep === true){
                        this.collapseChildNodes(true);
                    }
                }.createDelegate(this));
                return;
            }else{
                this.ui.collapse();
                this.fireEvent("collapse", this);
            }
        }
        if(deep === true){
            var cs = this.childNodes;
            for(var i = 0, len = cs.length; i < len; i++) {
            	cs[i].collapse(true, false);
            }
        }
    },

    
    delayedExpand : function(delay){
        if(!this.expandProcId){
            this.expandProcId = this.expand.defer(delay, this);
        }
    },

    
    cancelExpand : function(){
        if(this.expandProcId){
            clearTimeout(this.expandProcId);
        }
        this.expandProcId = false;
    },

    
    toggle : function(){
        if(this.expanded){
            this.collapse();
        }else{
            this.expand();
        }
    },

    
    ensureVisible : function(callback){
        var tree = this.getOwnerTree();
        tree.expandPath(this.parentNode.getPath(), false, function(){
            tree.getTreeEl().scrollChildIntoView(this.ui.anchor);
            Wtf.callback(callback);
        }.createDelegate(this));
    },

    
    expandChildNodes : function(deep){
        var cs = this.childNodes;
        for(var i = 0, len = cs.length; i < len; i++) {
        	cs[i].expand(deep);
        }
    },

    
    collapseChildNodes : function(deep){
        var cs = this.childNodes;
        for(var i = 0, len = cs.length; i < len; i++) {
        	cs[i].collapse(deep);
        }
    },

    
    disable : function(){
        this.disabled = true;
        this.unselect();
        if(this.rendered && this.ui.onDisableChange){ 
            this.ui.onDisableChange(this, true);
        }
        this.fireEvent("disabledchange", this, true);
    },

    
    enable : function(){
        this.disabled = false;
        if(this.rendered && this.ui.onDisableChange){ 
            this.ui.onDisableChange(this, false);
        }
        this.fireEvent("disabledchange", this, false);
    },

    
    renderChildren : function(suppressEvent){
        if(suppressEvent !== false){
            this.fireEvent("beforechildrenrendered", this);
        }
        var cs = this.childNodes;
        for(var i = 0, len = cs.length; i < len; i++){
            cs[i].render(true);
        }
        this.childrenRendered = true;
    },

    
    sort : function(fn, scope){
        Wtf.tree.TreeNode.superclass.sort.apply(this, arguments);
        if(this.childrenRendered){
            var cs = this.childNodes;
            for(var i = 0, len = cs.length; i < len; i++){
                cs[i].render(true);
            }
        }
    },

    
    render : function(bulkRender){
        this.ui.render(bulkRender);
        if(!this.rendered){
            
            this.getOwnerTree().registerNode(this);
            this.rendered = true;
            if(this.expanded){
                this.expanded = false;
                this.expand(false, false);
            }
        }
    },

    
    renderIndent : function(deep, refresh){
        if(refresh){
            this.ui.childIndent = null;
        }
        this.ui.renderIndent();
        if(deep === true && this.childrenRendered){
            var cs = this.childNodes;
            for(var i = 0, len = cs.length; i < len; i++){
                cs[i].renderIndent(true, refresh);
            }
        }
    },

    beginUpdate : function(){
        this.childrenRendered = false;
    },

    endUpdate : function(){
        if(this.expanded){
            this.renderChildren();
        }
    },

    destroy : function(){
        for(var i = 0,l = this.childNodes.length; i < l; i++){
            this.childNodes[i].destroy();
        }
        this.childNodes = null;
        if(this.ui.destroy){
            this.ui.destroy();
        }
    }
});

 Wtf.tree.AsyncTreeNode = function(config){
    this.loaded = false;
    this.loading = false;
    Wtf.tree.AsyncTreeNode.superclass.constructor.apply(this, arguments);
    
    this.addEvents('beforeload', 'load');
    
    
};
Wtf.extend(Wtf.tree.AsyncTreeNode, Wtf.tree.TreeNode, {
    expand : function(deep, anim, callback){
        if(this.loading){ 
            var timer;
            var f = function(){
                if(!this.loading){ 
                    clearInterval(timer);
                    this.expand(deep, anim, callback);
                }
            }.createDelegate(this);
            timer = setInterval(f, 200);
            return;
        }
        if(!this.loaded){
            if(this.fireEvent("beforeload", this) === false){
                return;
            }
            this.loading = true;
            this.ui.beforeLoad(this);
            var loader = this.loader || this.attributes.loader || this.getOwnerTree().getLoader();
            if(loader){
                loader.load(this, this.loadComplete.createDelegate(this, [deep, anim, callback]));
                return;
            }
        }
        Wtf.tree.AsyncTreeNode.superclass.expand.call(this, deep, anim, callback);
    },
    
    
    isLoading : function(){
        return this.loading;  
    },
    
    loadComplete : function(deep, anim, callback){
        this.loading = false;
        this.loaded = true;
        this.ui.afterLoad(this);
        this.fireEvent("load", this);
        this.expand(deep, anim, callback);
    },
    
    
    isLoaded : function(){
        return this.loaded;
    },
    
    hasChildNodes : function(){
        if(!this.isLeaf() && !this.loaded){
            return true;
        }else{
            return Wtf.tree.AsyncTreeNode.superclass.hasChildNodes.call(this);
        }
    },

    
    reload : function(callback){
        this.collapse(false, false);
        while(this.firstChild){
            this.removeChild(this.firstChild);
        }
        this.childrenRendered = false;
        this.loaded = false;
        if(this.isHiddenRoot()){
            this.expanded = false;
        }
        this.expand(false, false, callback);
    }
});

Wtf.tree.TreeNodeUI = function(node){
    this.node = node;
    this.rendered = false;
    this.animating = false;
    this.wasLeaf = true;
    this.ecc = 'x-tree-ec-icon x-tree-elbow';
    this.emptyIcon = Wtf.BLANK_IMAGE_URL;
};

Wtf.tree.TreeNodeUI.prototype = {
    
    removeChild : function(node){
        if(this.rendered){
            this.ctNode.removeChild(node.ui.getEl());
        } 
    },

    
    beforeLoad : function(){
         this.addClass("x-tree-node-loading");
    },

    
    afterLoad : function(){
         this.removeClass("x-tree-node-loading");
    },

    
    onTextChange : function(node, text, oldText){
        if(this.rendered){
            this.textNode.innerHTML = text;
        }
    },

    
    onDisableChange : function(node, state){
        this.disabled = state;
        if(state){
            this.addClass("x-tree-node-disabled");
        }else{
            this.removeClass("x-tree-node-disabled");
        } 
    },

    
    onSelectedChange : function(state){
        if(state){
            this.focus();
            this.addClass("x-tree-selected");
        }else{
            
            this.removeClass("x-tree-selected");
        }
    },

    
    onMove : function(tree, node, oldParent, newParent, index, refNode){
        this.childIndent = null;
        if(this.rendered){
            var targetNode = newParent.ui.getContainer();
            if(!targetNode){
                this.holder = document.createElement("div");
                this.holder.appendChild(this.wrap);
                return;
            }
            var insertBefore = refNode ? refNode.ui.getEl() : null;
            if(insertBefore){
                targetNode.insertBefore(this.wrap, insertBefore);
            }else{
                targetNode.appendChild(this.wrap);
            }
            this.node.renderIndent(true);
        }
    },


    addClass : function(cls){
        if(this.elNode){
            Wtf.fly(this.elNode).addClass(cls);
        }
    },


    removeClass : function(cls){
        if(this.elNode){
            Wtf.fly(this.elNode).removeClass(cls);  
        }
    },

    
    remove : function(){
        if(this.rendered){
            this.holder = document.createElement("div");
            this.holder.appendChild(this.wrap);
        }  
    },

    
    fireEvent : function(){
        return this.node.fireEvent.apply(this.node, arguments);  
    },

    
    initEvents : function(){
        this.node.on("move", this.onMove, this);

        if(this.node.disabled){
            this.addClass("x-tree-node-disabled");
        }
        if(this.node.hidden){
            this.hide();
        }
        var ot = this.node.getOwnerTree();
        var dd = ot.enableDD || ot.enableDrag || ot.enableDrop;
        if(dd && (!this.node.isRoot || ot.rootVisible)){
            Wtf.dd.Registry.register(this.elNode, {
                node: this.node,
                handles: this.getDDHandles(),
                isHandle: false
            });
        }
    },

    
    getDDHandles : function(){
        return [this.iconNode, this.textNode, this.elNode];
    },


    hide : function(){
        this.node.hidden = true;
        if(this.wrap){
            this.wrap.style.display = "none";
        }
    },


    show : function(){
        this.node.hidden = false;
        if(this.wrap){
            this.wrap.style.display = "";
        } 
    },

    
    onContextMenu : function(e){
        if (this.node.hasListener("contextmenu") || this.node.getOwnerTree().hasListener("contextmenu")) {
            e.preventDefault();
            this.focus();
            this.fireEvent("contextmenu", this.node, e);
        }
    },

    
    onClick : function(e){
        if(this.dropping){
            e.stopEvent();
            return;
        }
        if(this.fireEvent("beforeclick", this.node, e) !== false){
            var a = e.getTarget('a');
            if(!this.disabled && this.node.attributes.href && a){
                this.fireEvent("click", this.node, e);
                return;
            }else if(a && e.ctrlKey){
                e.stopEvent();
            }
            e.preventDefault();
            if(this.disabled){
                return;
            }

            if(this.node.attributes.singleClickExpand && !this.animating && this.node.hasChildNodes()){
                this.node.toggle();
            }

            this.fireEvent("click", this.node, e);
        }else{
            e.stopEvent();
        }
    },

    
    onDblClick : function(e){
        e.preventDefault();
        if(this.disabled){
            return;
        }
        if(this.checkbox){
            this.toggleCheck();
        }
        if(!this.animating && this.node.hasChildNodes()){
            this.node.toggle();
        }
        this.fireEvent("dblclick", this.node, e);
    },

    onOver : function(e){
        this.addClass('x-tree-node-over');
    },

    onOut : function(e){
        this.removeClass('x-tree-node-over');
    },

    
    onCheckChange : function(){
        var checked = this.checkbox.checked;
        this.node.attributes.checked = checked;
        this.fireEvent('checkchange', this.node, checked);
    },

    
    ecClick : function(e){
        if(!this.animating && (this.node.hasChildNodes() || this.node.attributes.expandable)){
            this.node.toggle();
        }
    },

    
    startDrop : function(){
        this.dropping = true;
    },
    
    
    endDrop : function(){ 
       setTimeout(function(){
           this.dropping = false;
       }.createDelegate(this), 50); 
    },

    
    expand : function(){
        this.updateExpandIcon();
        this.ctNode.style.display = "";
    },

    
    focus : function(){
        if(!this.node.preventHScroll){
            try{this.anchor.focus();
            }catch(e){}
        }else if(!Wtf.isIE){
            try{
                var noscroll = this.node.getOwnerTree().getTreeEl().dom;
                var l = noscroll.scrollLeft;
                this.anchor.focus();
                noscroll.scrollLeft = l;
            }catch(e){}
        }
    },


    toggleCheck : function(value){
        var cb = this.checkbox;
        if(cb){
            cb.checked = (value === undefined ? !cb.checked : value);
        }
    },

    
    blur : function(){
        try{
            this.anchor.blur();
        }catch(e){} 
    },

    
    animExpand : function(callback){
        var ct = Wtf.get(this.ctNode);
        ct.stopFx();
        if(!this.node.hasChildNodes()){
            this.updateExpandIcon();
            this.ctNode.style.display = "";
            Wtf.callback(callback);
            return;
        }
        this.animating = true;
        this.updateExpandIcon();
        
        ct.slideIn('t', {
           callback : function(){
               this.animating = false;
               Wtf.callback(callback);
            },
            scope: this,
            duration: this.node.ownerTree.duration || .25
        });
    },

    
    highlight : function(){
        var tree = this.node.getOwnerTree();
        Wtf.fly(this.wrap).highlight(
            tree.hlColor || "C3DAF9",
            {endColor: tree.hlBaseColor}
        );
    },

    
    collapse : function(){
        this.updateExpandIcon();
        this.ctNode.style.display = "none";
    },

    
    animCollapse : function(callback){
        var ct = Wtf.get(this.ctNode);
        ct.enableDisplayMode('block');
        ct.stopFx();

        this.animating = true;
        this.updateExpandIcon();

        ct.slideOut('t', {
            callback : function(){
               this.animating = false;
               Wtf.callback(callback);
            },
            scope: this,
            duration: this.node.ownerTree.duration || .25
        });
    },

    
    getContainer : function(){
        return this.ctNode;  
    },

    
    getEl : function(){
        return this.wrap;  
    },

    
    appendDDGhost : function(ghostNode){
        ghostNode.appendChild(this.elNode.cloneNode(true));
    },

    
    getDDRepairXY : function(){
        return Wtf.lib.Dom.getXY(this.iconNode);
    },

    
    onRender : function(){
        this.render();    
    },

    
    render : function(bulkRender){
        var n = this.node, a = n.attributes;
        var targetNode = n.parentNode ? 
              n.parentNode.ui.getContainer() : n.ownerTree.innerCt.dom;
        
        if(!this.rendered){
            this.rendered = true;

            this.renderElements(n, a, targetNode, bulkRender);

            if(a.qtip){
               if(this.textNode.setAttributeNS){
                   this.textNode.setAttributeNS("wtf", "qtip", a.qtip);
                   if(a.qtipTitle){
                       this.textNode.setAttributeNS("wtf", "qtitle", a.qtipTitle);
                   }
               }else{
                   this.textNode.setAttribute("wtf:qtip", a.qtip);
                   if(a.qtipTitle){
                       this.textNode.setAttribute("wtf:qtitle", a.qtipTitle);
                   }
               } 
            }else if(a.qtipCfg){
                a.qtipCfg.target = Wtf.id(this.textNode);
                Wtf.QuickTips.register(a.qtipCfg);
            }
            this.initEvents();
            if(!this.node.expanded){
                this.updateExpandIcon(true);
            }
        }else{
            if(bulkRender === true) {
                targetNode.appendChild(this.wrap);
            }
        }
    },

    
    renderElements : function(n, a, targetNode, bulkRender){
        
        this.indentMarkup = n.parentNode ? n.parentNode.ui.getChildIndent() : '';

        var cb = typeof a.checked == 'boolean';

        var href = a.href ? a.href : Wtf.isGecko ? "" : "#";
        var buf = ['<li class="x-tree-node"><div wtf:tree-node-id="',n.id,'" class="x-tree-node-el x-tree-node-leaf x-unselectable ', a.cls,'" unselectable="on">',
            '<span class="x-tree-node-indent">',this.indentMarkup,"</span>",
            '<img src="', this.emptyIcon, '" class="x-tree-ec-icon x-tree-elbow" />',
            '<img src="', a.icon || this.emptyIcon, '" class="x-tree-node-icon',(a.icon ? " x-tree-node-inline-icon" : ""),(a.iconCls ? " "+a.iconCls : ""),'" unselectable="on" />',
            cb ? ('<input class="x-tree-node-cb" type="checkbox" ' + (a.checked ? 'checked="checked" />' : '/>')) : '',
            '<a hidefocus="on" class="x-tree-node-anchor" href="',href,'" tabIndex="1" ',
             a.hrefTarget ? ' target="'+a.hrefTarget+'"' : "", '><span unselectable="on">',n.text,"</span></a></div>",
            '<ul class="x-tree-node-ct" style="display:none;"></ul>',
            "</li>"].join('');

        var nel;
        if(bulkRender !== true && n.nextSibling && (nel = n.nextSibling.ui.getEl())){
            this.wrap = Wtf.DomHelper.insertHtml("beforeBegin", nel, buf);
        }else{
            this.wrap = Wtf.DomHelper.insertHtml("beforeEnd", targetNode, buf);
        }
        
        this.elNode = this.wrap.childNodes[0];
        this.ctNode = this.wrap.childNodes[1];
        var cs = this.elNode.childNodes;
        this.indentNode = cs[0];
        this.ecNode = cs[1];
        this.iconNode = cs[2];
        var index = 3;
        if(cb){
            this.checkbox = cs[3];
            index++;
        }
        this.anchor = cs[index];
        this.textNode = cs[index].firstChild;
    },


    getAnchor : function(){
        return this.anchor;
    },
    

    getTextEl : function(){
        return this.textNode;
    },
    

    getIconEl : function(){
        return this.iconNode;
    },


    isChecked : function(){
        return this.checkbox ? this.checkbox.checked : false; 
    },

    
    updateExpandIcon : function(){
        if(this.rendered){
            var n = this.node, c1, c2;
            var cls = n.isLast() ? "x-tree-elbow-end" : "x-tree-elbow";
            var hasChild = n.hasChildNodes();
            if(hasChild || n.attributes.expandable){
                if(n.expanded){
                    cls += "-minus";
                    c1 = "x-tree-node-collapsed";
                    c2 = "x-tree-node-expanded";
                }else{
                    cls += "-plus";
                    c1 = "x-tree-node-expanded";
                    c2 = "x-tree-node-collapsed";
                }
                if(this.wasLeaf){
                    this.removeClass("x-tree-node-leaf");
                    this.wasLeaf = false;
                }
                if(this.c1 != c1 || this.c2 != c2){
                    Wtf.fly(this.elNode).replaceClass(c1, c2);
                    this.c1 = c1; this.c2 = c2;
                }
            }else{
                if(!this.wasLeaf){
                    Wtf.fly(this.elNode).replaceClass("x-tree-node-expanded", "x-tree-node-leaf");
                    delete this.c1;
                    delete this.c2;
                    this.wasLeaf = true;
                }
            }
            var ecc = "x-tree-ec-icon "+cls;
            if(this.ecc != ecc){
                this.ecNode.className = ecc;
                this.ecc = ecc;
            }
        }
    },

    
    getChildIndent : function(){
        if(!this.childIndent){
            var buf = [];
            var p = this.node;
            while(p){
                if(!p.isRoot || (p.isRoot && p.ownerTree.rootVisible)){
                    if(!p.isLast()) {
                        buf.unshift('<img src="'+this.emptyIcon+'" class="x-tree-elbow-line" />');
                    } else {
                        buf.unshift('<img src="'+this.emptyIcon+'" class="x-tree-icon" />');
                    }
                }
                p = p.parentNode;
            }
            this.childIndent = buf.join("");
        }
        return this.childIndent;
    },

    
    renderIndent : function(){
        if(this.rendered){
            var indent = "";
            var p = this.node.parentNode;
            if(p){
                indent = p.ui.getChildIndent();
            }
            if(this.indentMarkup != indent){ 
                this.indentNode.innerHTML = indent;
                this.indentMarkup = indent;
            }
            this.updateExpandIcon();
        }
    },

    destroy : function(){
        if(this.elNode){
            Wtf.dd.Registry.unregister(this.elNode.id);
        }
        delete this.elNode;
        delete this.ctNode;
        delete this.indentNode;
        delete this.ecNode;
        delete this.iconNode;
        delete this.checkbox;
        delete this.anchor;
        delete this.textNode;
        Wtf.removeNode(this.ctNode);
    }
};


Wtf.tree.RootTreeNodeUI = Wtf.extend(Wtf.tree.TreeNodeUI, {
    
    render : function(){
        if(!this.rendered){
            var targetNode = this.node.ownerTree.innerCt.dom;
            this.node.expanded = true;
            targetNode.innerHTML = '<div class="x-tree-root-node"></div>';
            this.wrap = this.ctNode = targetNode.firstChild;
        }
    },
    collapse : Wtf.emptyFn,
    expand : Wtf.emptyFn
});

Wtf.tree.TreeLoader = function(config){
    this.baseParams = {};
    this.requestMethod = "POST";
    Wtf.apply(this, config);

    this.addEvents(
        
        "beforeload",
        
        "load",
        
        "loadexception"
    );

    Wtf.tree.TreeLoader.superclass.constructor.call(this);
};

Wtf.extend(Wtf.tree.TreeLoader, Wtf.util.Observable, {
    
    
    
    
    
    
    
    uiProviders : {},

    
    clearOnLoad : true,

    
    load : function(node, callback){
        if(this.clearOnLoad){
            while(node.firstChild){
                node.removeChild(node.firstChild);
            }
        }
        if(this.doPreload(node)){ 
            if(typeof callback == "function"){
                callback();
            }
        }else if(this.dataUrl||this.url){
            this.requestData(node, callback);
        }
    },

    doPreload : function(node){
        if(node.attributes.children){
            if(node.childNodes.length < 1){ 
                var cs = node.attributes.children;
                node.beginUpdate();
                for(var i = 0, len = cs.length; i < len; i++){
                    var cn = node.appendChild(this.createNode(cs[i]));
                    if(this.preloadChildren){
                        this.doPreload(cn);
                    }
                }
                node.endUpdate();
            }
            return true;
        }else {
            return false;
        }
    },

    getParams: function(node){
        var buf = [], bp = this.baseParams;
        for(var key in bp){
            if(typeof bp[key] != "function"){
                buf.push(encodeURIComponent(key), "=", encodeURIComponent(bp[key]), "&");
            }
        }
        buf.push("node=", encodeURIComponent(node.id));
        return buf.join("");
    },

    requestData : function(node, callback){
        if(this.fireEvent("beforeload", this, node, callback) !== false){
            this.transId = Wtf.Ajax.request({
                method:this.requestMethod,
                url: this.dataUrl||this.url,
                success: this.handleResponse,
                failure: this.handleFailure,
                scope: this,
                argument: {callback: callback, node: node},
                params: this.getParams(node)
            });
        }else{
            
            
            if(typeof callback == "function"){
                callback();
            }
        }
    },

    isLoading : function(){
        return this.transId ? true : false;
    },

    abort : function(){
        if(this.isLoading()){
            Wtf.Ajax.abort(this.transId);
        }
    },

    
    createNode : function(attr){
        
        if(this.baseAttrs){
            Wtf.applyIf(attr, this.baseAttrs);
        }
        if(this.applyLoader !== false){
            attr.loader = this;
        }
        if(typeof attr.uiProvider == 'string'){
           attr.uiProvider = this.uiProviders[attr.uiProvider] || eval(attr.uiProvider);
        }
        return(attr.leaf ?
                        new Wtf.tree.TreeNode(attr) :
                        new Wtf.tree.AsyncTreeNode(attr));
    },

    processResponse : function(response, node, callback){
        var json = response.responseText;
        try {
            var o = eval("("+json+")");
            node.beginUpdate();
            for(var i = 0, len = o.length; i < len; i++){
                var n = this.createNode(o[i]);
                if(n){
                    node.appendChild(n);
                }
            }
            node.endUpdate();
            if(typeof callback == "function"){
                callback(this, node);
            }
        }catch(e){
            this.handleFailure(response);
        }
    },

    handleResponse : function(response){
        this.transId = false;
        var a = response.argument;
        this.processResponse(response, a.node, a.callback);
        this.fireEvent("load", this, a.node, response);
    },

    handleFailure : function(response){
        this.transId = false;
        var a = response.argument;
        this.fireEvent("loadexception", this, a.node, response);
        if(typeof a.callback == "function"){
            a.callback(this, a.node);
        }
    }
});

Wtf.tree.TreeFilter = function(tree, config){
    this.tree = tree;
    this.filtered = {};
    Wtf.apply(this, config);
};

Wtf.tree.TreeFilter.prototype = {
    clearBlank:false,
    reverse:false,
    autoClear:false,
    remove:false,

     
    filter : function(value, attr, startNode){
        attr = attr || "text";
        var f;
        if(typeof value == "string"){
            var vlen = value.length;
            
            if(vlen == 0 && this.clearBlank){
                this.clear();
                return;
            }
            value = value.toLowerCase();
            f = function(n){
                return n.attributes[attr].substr(0, vlen).toLowerCase() == value;
            };
        }else if(value.exec){ 
            f = function(n){
                return value.test(n.attributes[attr]);
            };
        }else{
            throw 'Illegal filter type, must be string or regex';
        }
        this.filterBy(f, null, startNode);
	},
    
    
    filterBy : function(fn, scope, startNode){
        startNode = startNode || this.tree.root;
        if(this.autoClear){
            this.clear();
        }
        var af = this.filtered, rv = this.reverse;
        var f = function(n){
            if(n == startNode){
                return true;
            }
            if(af[n.id]){
                return false;
            }
            var m = fn.call(scope || n, n);
            if(!m || rv){
                af[n.id] = n;
                n.ui.hide();
                return false;
            }
            return true;
        };
        startNode.cascade(f);
        if(this.remove){
           for(var id in af){
               if(typeof id != "function"){
                   var n = af[id];
                   if(n && n.parentNode){
                       n.parentNode.removeChild(n);
                   }
               }
           } 
        }
    },
    
    
    clear : function(){
        var t = this.tree;
        var af = this.filtered;
        for(var id in af){
            if(typeof id != "function"){
                var n = af[id];
                if(n){
                    n.ui.show();
                }
            }
        }
        this.filtered = {}; 
    }
};


Wtf.tree.TreeSorter = function(tree, config){
    Wtf.apply(this, config);
    tree.on("beforechildrenrendered", this.doSort, this);
    tree.on("append", this.updateSort, this);
    tree.on("insert", this.updateSort, this);
    
    var dsc = this.dir && this.dir.toLowerCase() == "desc";
    var p = this.property || "text";
    var sortType = this.sortType;
    var fs = this.folderSort;
    var cs = this.caseSensitive === true;
    var leafAttr = this.leafAttr || 'leaf';

    this.sortFn = function(n1, n2){
        if(fs){
            if(n1.attributes[leafAttr] && !n2.attributes[leafAttr]){
                return 1;
            }
            if(!n1.attributes[leafAttr] && n2.attributes[leafAttr]){
                return -1;
            }
        }
    	var v1 = sortType ? sortType(n1) : (cs ? n1.attributes[p] : n1.attributes[p].toUpperCase());
    	var v2 = sortType ? sortType(n2) : (cs ? n2.attributes[p] : n2.attributes[p].toUpperCase());
    	if(v1 < v2){
			return dsc ? +1 : -1;
		}else if(v1 > v2){
			return dsc ? -1 : +1;
        }else{
	    	return 0;
        }
    };
};

Wtf.tree.TreeSorter.prototype = {
    doSort : function(node){
        node.sort(this.sortFn);
    },
    
    compareNodes : function(n1, n2){
        
        return (n1.text.toUpperCase() > n2.text.toUpperCase() ? 1 : -1);
    },
    
    updateSort : function(tree, node){
        if(node.childrenRendered){
            this.doSort.defer(1, this, [node]);
        }
    }
};

if(Wtf.dd.DropZone){
    
Wtf.tree.TreeDropZone = function(tree, config){
    
    this.allowParentInsert = false;
    
    this.allowContainerDrop = false;
    
    this.appendOnly = false;
    Wtf.tree.TreeDropZone.superclass.constructor.call(this, tree.innerCt, config);
    
    this.tree = tree;
    
    this.dragOverData = {};
    
    this.lastInsertClass = "x-tree-no-status";
};

Wtf.extend(Wtf.tree.TreeDropZone, Wtf.dd.DropZone, {
    
    ddGroup : "TreeDD",

    
    expandDelay : 1000,

    
    expandNode : function(node){
        if(node.hasChildNodes() && !node.isExpanded()){
            node.expand(false, null, this.triggerCacheRefresh.createDelegate(this));
        }
    },

    
    queueExpand : function(node){
        this.expandProcId = this.expandNode.defer(this.expandDelay, this, [node]);
    },

    
    cancelExpand : function(){
        if(this.expandProcId){
            clearTimeout(this.expandProcId);
            this.expandProcId = false;
        }
    },

    
    isValidDropPoint : function(n, pt, dd, e, data){
        if(!n || !data){ return false; }
        var targetNode = n.node;
        var dropNode = data.node;
        
        if(!(targetNode && targetNode.isTarget && pt)){
            return false;
        }
        if(pt == "append" && targetNode.allowChildren === false){
            return false;
        }
        if((pt == "above" || pt == "below") && (targetNode.parentNode && targetNode.parentNode.allowChildren === false)){
            return false;
        }
        if(dropNode && (targetNode == dropNode || dropNode.contains(targetNode))){
            return false;
        }
        
        var overEvent = this.dragOverData;
        overEvent.tree = this.tree;
        overEvent.target = targetNode;
        overEvent.data = data;
        overEvent.point = pt;
        overEvent.source = dd;
        overEvent.rawEvent = e;
        overEvent.dropNode = dropNode;
        overEvent.cancel = false;  
        var result = this.tree.fireEvent("nodedragover", overEvent);
        return overEvent.cancel === false && result !== false;
    },

    
    getDropPoint : function(e, n, dd){
        var tn = n.node;
        if(tn.isRoot){
            return tn.allowChildren !== false ? "append" : false; 
        }
        var dragEl = n.ddel;
        var t = Wtf.lib.Dom.getY(dragEl), b = t + dragEl.offsetHeight;
        var y = Wtf.lib.Event.getPageY(e);
        var noAppend = tn.allowChildren === false || tn.isLeaf();
        if(this.appendOnly || tn.parentNode.allowChildren === false){
            return noAppend ? false : "append";
        }
        var noBelow = false;
        if(!this.allowParentInsert){
            noBelow = tn.hasChildNodes() && tn.isExpanded();
        }
        var q = (b - t) / (noAppend ? 2 : 3);
        if(y >= t && y < (t + q)){
            return "above";
        }else if(!noBelow && (noAppend || y >= b-q && y <= b)){
            return "below";
        }else{
            return "append";
        }
    },

    
    onNodeEnter : function(n, dd, e, data){
        this.cancelExpand();
    },

    
    onNodeOver : function(n, dd, e, data){
        var pt = this.getDropPoint(e, n, dd);
        var node = n.node;
        
        
        if(!this.expandProcId && pt == "append" && node.hasChildNodes() && !n.node.isExpanded()){
            this.queueExpand(node);
        }else if(pt != "append"){
            this.cancelExpand();
        }
        
        
        var returnCls = this.dropNotAllowed;
        if(this.isValidDropPoint(n, pt, dd, e, data)){
           if(pt){
               var el = n.ddel;
               var cls;
               if(pt == "above"){
                   returnCls = n.node.isFirst() ? "x-tree-drop-ok-above" : "x-tree-drop-ok-between";
                   cls = "x-tree-drag-insert-above";
               }else if(pt == "below"){
                   returnCls = n.node.isLast() ? "x-tree-drop-ok-below" : "x-tree-drop-ok-between";
                   cls = "x-tree-drag-insert-below";
               }else{
                   returnCls = "x-tree-drop-ok-append";
                   cls = "x-tree-drag-append";
               }
               if(this.lastInsertClass != cls){
                   Wtf.fly(el).replaceClass(this.lastInsertClass, cls);
                   this.lastInsertClass = cls;
               }
           }
       }
       return returnCls;
    },

    
    onNodeOut : function(n, dd, e, data){
        this.cancelExpand();
        this.removeDropIndicators(n);
    },

    
    onNodeDrop : function(n, dd, e, data){
        var point = this.getDropPoint(e, n, dd);
        var targetNode = n.node;
        targetNode.ui.startDrop();
        if(!this.isValidDropPoint(n, point, dd, e, data)){
            targetNode.ui.endDrop();
            return false;
        }
        
        var dropNode = data.node || (dd.getTreeNode ? dd.getTreeNode(data, targetNode, point, e) : null);
        var dropEvent = {
            tree : this.tree,
            target: targetNode,
            data: data,
            point: point,
            source: dd,
            rawEvent: e,
            dropNode: dropNode,
            cancel: !dropNode   
        };
        var retval = this.tree.fireEvent("beforenodedrop", dropEvent);
        if(retval === false || dropEvent.cancel === true || !dropEvent.dropNode){
            targetNode.ui.endDrop();
            return false;
        }
        
        targetNode = dropEvent.target;
        if(point == "append" && !targetNode.isExpanded()){
            targetNode.expand(false, null, function(){
                this.completeDrop(dropEvent);
            }.createDelegate(this));
        }else{
            this.completeDrop(dropEvent);
        }
        return true;
    },

    
    completeDrop : function(de){
        var ns = de.dropNode, p = de.point, t = de.target;
        if(!(ns instanceof Array)){
            ns = [ns];
        }
        var n;
        for(var i = 0, len = ns.length; i < len; i++){
            n = ns[i];
            if(p == "above"){
                t.parentNode.insertBefore(n, t);
            }else if(p == "below"){
                t.parentNode.insertBefore(n, t.nextSibling);
            }else{
                t.appendChild(n);
            }
        }
        n.ui.focus();
        if(this.tree.hlDrop){
            n.ui.highlight();
        }
        t.ui.endDrop();
        this.tree.fireEvent("nodedrop", de);
    },

    
    afterNodeMoved : function(dd, data, e, targetNode, dropNode){
        if(this.tree.hlDrop){
            dropNode.ui.focus();
            dropNode.ui.highlight();
        }
        this.tree.fireEvent("nodedrop", this.tree, targetNode, data, dd, e);
    },

    
    getTree : function(){
        return this.tree;
    },

    
    removeDropIndicators : function(n){
        if(n && n.ddel){
            var el = n.ddel;
            Wtf.fly(el).removeClass([
                    "x-tree-drag-insert-above",
                    "x-tree-drag-insert-below",
                    "x-tree-drag-append"]);
            this.lastInsertClass = "_noclass";
        }
    },

    
    beforeDragDrop : function(target, e, id){
        this.cancelExpand();
        return true;
    },

    
    afterRepair : function(data){
        if(data && Wtf.enableFx){
            data.node.ui.highlight();
        }
        this.hideProxy();
    }    
});

}

if(Wtf.dd.DragZone){
Wtf.tree.TreeDragZone = function(tree, config){
    Wtf.tree.TreeDragZone.superclass.constructor.call(this, tree.getTreeEl(), config);
    
    this.tree = tree;
};

Wtf.extend(Wtf.tree.TreeDragZone, Wtf.dd.DragZone, {
    
    ddGroup : "TreeDD",

    
    onBeforeDrag : function(data, e){
        var n = data.node;
        return n && n.draggable && !n.disabled;
    },

    
    onInitDrag : function(e){
        var data = this.dragData;
        this.tree.getSelectionModel().select(data.node);
        this.tree.eventModel.disable();
        this.proxy.update("");
        data.node.ui.appendDDGhost(this.proxy.ghost.dom);
        this.tree.fireEvent("startdrag", this.tree, data.node, e);
    },

    
    getRepairXY : function(e, data){
        return data.node.ui.getDDRepairXY();
    },

    
    onEndDrag : function(data, e){
        this.tree.eventModel.enable.defer(100, this.tree.eventModel);
        this.tree.fireEvent("enddrag", this.tree, data.node, e);
    },

    
    onValidDrop : function(dd, e, id){
        this.tree.fireEvent("dragdrop", this.tree, this.dragData.node, dd, e);
        this.hideProxy();
    },

    
    beforeInvalidDrop : function(e, id){
        
        var sm = this.tree.getSelectionModel();
        sm.clearSelections();
        sm.select(this.dragData.node);
    }
});
}

Wtf.tree.TreeEditor = function(tree, config){
    config = config || {};
    var field = config.events ? config : new Wtf.form.TextField(config);
    Wtf.tree.TreeEditor.superclass.constructor.call(this, field);

    this.tree = tree;

    if(!tree.rendered){
        tree.on('render', this.initEditor, this);
    }else{
        this.initEditor(tree);
    }
};

Wtf.extend(Wtf.tree.TreeEditor, Wtf.Editor, {
    
    alignment: "l-l",
        autoSize: false,
    
    hideEl : false,
    
    cls: "x-small-editor x-tree-editor",
    
    shim:false,
        shadow:"frame",
    
    maxWidth: 250,
    
    editDelay : 350,

    initEditor : function(tree){
        tree.on('beforeclick', this.beforeNodeClick, this);
        this.on('complete', this.updateNode, this);
        this.on('beforestartedit', this.fitToTree, this);
        this.on('startedit', this.bindScroll, this, {delay:10});
        this.on('specialkey', this.onSpecialKey, this);
    },

        fitToTree : function(ed, el){
        var td = this.tree.getTreeEl().dom, nd = el.dom;
        if(td.scrollLeft >  nd.offsetLeft){             td.scrollLeft = nd.offsetLeft;
        }
        var w = Math.min(
                this.maxWidth,
                (td.clientWidth > 20 ? td.clientWidth : td.offsetWidth) - Math.max(0, nd.offsetLeft-td.scrollLeft) - 5);
        this.setSize(w, '');
    },

        triggerEdit : function(node){
        this.completeEdit();
        this.editNode = node;
        this.startEdit(node.ui.textNode, node.text);
    },

        bindScroll : function(){
        this.tree.getTreeEl().on('scroll', this.cancelEdit, this);
    },

        beforeNodeClick : function(node, e){
        var sinceLast = (this.lastClick ? this.lastClick.getElapsed() : 0);
        this.lastClick = new Date();
        if(sinceLast > this.editDelay && this.tree.getSelectionModel().isSelected(node)){
            e.stopEvent();
            this.triggerEdit(node);
            return false;
        }
    },

        updateNode : function(ed, value){
        this.tree.getTreeEl().un('scroll', this.cancelEdit, this);
        this.editNode.setText(value);
    },

        onHide : function(){
        Wtf.tree.TreeEditor.superclass.onHide.call(this);
        if(this.editNode){
            this.editNode.ui.focus();
        }
    },

        onSpecialKey : function(field, e){
        var k = e.getKey();
        if(k == e.ESC){
            e.stopEvent();
            this.cancelEdit();
        }else if(k == e.ENTER && !e.hasModifier()){
            e.stopEvent();
            this.completeEdit();
        }
    }
});

Wtf.menu.Menu = function(config){
    if(config instanceof Array){
        config = {items:config};
    }
    Wtf.apply(this, config);
    this.id = this.id || Wtf.id();
    this.addEvents(
        
        'beforeshow',
        
        'beforehide',
        
        'show',
        
        'hide',
        
        'click',
        
        'mouseover',
        
        'mouseout',
        
        'itemclick'
    );
    Wtf.menu.MenuMgr.register(this);
    Wtf.menu.Menu.superclass.constructor.call(this);
    var mis = this.items;
    this.items = new Wtf.util.MixedCollection();
    if(mis){
        this.add.apply(this, mis);
    }
};

Wtf.extend(Wtf.menu.Menu, Wtf.util.Observable, {
    
    
    
    minWidth : 120,
    
    shadow : "sides",
    
    subMenuAlign : "tl-tr?",
    
    defaultAlign : "tl-bl?",
    
    allowOtherMenus : false,

    hidden:true,

    createEl : function(){
        return new Wtf.Layer({
            cls: "x-menu",
            shadow:this.shadow,
            constrain: false,
            parentEl: this.parentEl || document.body,
            zindex:15000
        });
    },

        render : function(){
        if(this.el){
            return;
        }
        var el = this.el = this.createEl();

        this.keyNav = new Wtf.menu.MenuNav(this);

        if(this.plain){
            el.addClass("x-menu-plain");
        }
        if(this.cls){
            el.addClass(this.cls);
        }
                this.focusEl = el.createChild({
            tag: "a", cls: "x-menu-focus", href: "#", onclick: "return false;", tabIndex:"-1"
        });
        var ul = el.createChild({tag: "ul", cls: "x-menu-list"});
        ul.on("click", this.onClick, this);
        ul.on("mouseover", this.onMouseOver, this);
        ul.on("mouseout", this.onMouseOut, this);
        this.items.each(function(item){
            var li = document.createElement("li");
            li.className = "x-menu-list-item";
            ul.dom.appendChild(li);
            item.render(li, this);
        }, this);
        this.ul = ul;
        this.autoWidth();
    },

        autoWidth : function(){
        var el = this.el, ul = this.ul;
        if(!el){
            return;
        }
        var w = this.width;
        if(w){
            el.setWidth(w);
        }else if(Wtf.isIE){
            el.setWidth(this.minWidth);
            var t = el.dom.offsetWidth;             el.setWidth(ul.getWidth()+el.getFrameWidth("lr"));
        }
    },

        delayAutoWidth : function(){
        if(this.el){
            if(!this.awTask){
                this.awTask = new Wtf.util.DelayedTask(this.autoWidth, this);
            }
            this.awTask.delay(20);
        }
    },

        findTargetItem : function(e){
        var t = e.getTarget(".x-menu-list-item", this.ul,  true);
        if(t && t.menuItemId){
            return this.items.get(t.menuItemId);
        }
    },

        onClick : function(e){
        var t;
        if(t = this.findTargetItem(e)){
            t.onClick(e);
            this.fireEvent("click", this, t, e);
        }
    },

        setActiveItem : function(item, autoExpand){
        if(item != this.activeItem){
            if(this.activeItem){
                this.activeItem.deactivate();
            }
            this.activeItem = item;
            item.activate(autoExpand);
        }else if(autoExpand){
            item.expandMenu();
        }
    },

        tryActivate : function(start, step){
        var items = this.items;
        for(var i = start, len = items.length; i >= 0 && i < len; i+= step){
            var item = items.get(i);
            if(!item.disabled && item.canActivate){
                this.setActiveItem(item, false);
                return item;
            }
        }
        return false;
    },

        onMouseOver : function(e){
        var t;
        if(t = this.findTargetItem(e)){
            if(t.canActivate && !t.disabled){
                this.setActiveItem(t, true);
            }
        }
        this.fireEvent("mouseover", this, e, t);
    },

        onMouseOut : function(e){
        var t;
        if(t = this.findTargetItem(e)){
            if(t == this.activeItem && t.shouldDeactivate(e)){
                this.activeItem.deactivate();
                delete this.activeItem;
            }
        }
        this.fireEvent("mouseout", this, e, t);
    },

    
    isVisible : function(){
        return this.el && !this.hidden;
    },

    
    show : function(el, pos, parentMenu){
        this.parentMenu = parentMenu;
        if(!this.el){
            this.render();
        }
        this.fireEvent("beforeshow", this);
        this.showAt(this.el.getAlignToXY(el, pos || this.defaultAlign), parentMenu, false);
    },

    
    showAt : function(xy, parentMenu, _e){
        this.parentMenu = parentMenu;
        if(!this.el){
            this.render();
        }
        if(_e !== false){
            this.fireEvent("beforeshow", this);
            xy = this.el.adjustForConstraints(xy);
        }
        this.el.setXY(xy);
        this.el.show();
        this.hidden = false;
        this.focus();
        this.fireEvent("show", this);
    },

    

    focus : function(){
        if(!this.hidden){
            this.doFocus.defer(50, this);
        }
    },

    doFocus : function(){
        if(!this.hidden){
            this.focusEl.focus();
        }
    },

    
    hide : function(deep){
        if(this.el && this.isVisible()){
            this.fireEvent("beforehide", this);
            if(this.activeItem){
                this.activeItem.deactivate();
                this.activeItem = null;
            }
            this.el.hide();
            this.hidden = true;
            this.fireEvent("hide", this);
        }
        if(deep === true && this.parentMenu){
            this.parentMenu.hide(true);
        }
    },

    
    add : function(){
        var a = arguments, l = a.length, item;
        for(var i = 0; i < l; i++){
            var el = a[i];
            if(el.render){                 item = this.addItem(el);
            }else if(typeof el == "string"){                 if(el == "separator" || el == "-"){
                    item = this.addSeparator();
                }else{
                    item = this.addText(el);
                }
            }else if(el.tagName || el.el){                 item = this.addElement(el);
            }else if(typeof el == "object"){                 Wtf.applyIf(el, this.defaults);
                item = this.addMenuItem(el);
            }
        }
        return item;
    },

    
    getEl : function(){
        if(!this.el){
            this.render();
        }
        return this.el;
    },

    
    addSeparator : function(){
        return this.addItem(new Wtf.menu.Separator());
    },

    
    addElement : function(el){
        return this.addItem(new Wtf.menu.BaseItem(el));
    },

    
    addItem : function(item){
        this.items.add(item);
        if(this.ul){
            var li = document.createElement("li");
            li.className = "x-menu-list-item";
            this.ul.dom.appendChild(li);
            item.render(li, this);
            this.delayAutoWidth();
        }
        return item;
    },

    
    addMenuItem : function(config){
        if(!(config instanceof Wtf.menu.Item)){
            if(typeof config.checked == "boolean"){                 config = new Wtf.menu.CheckItem(config);
            }else{
                config = new Wtf.menu.Item(config);
            }
        }
        return this.addItem(config);
    },

    
    addText : function(text){
        return this.addItem(new Wtf.menu.TextItem(text));
    },

    
    insert : function(index, item){
        this.items.insert(index, item);
        if(this.ul){
            var li = document.createElement("li");
            li.className = "x-menu-list-item";
            this.ul.dom.insertBefore(li, this.ul.dom.childNodes[index]);
            item.render(li, this);
            this.delayAutoWidth();
        }
        return item;
    },

    
    remove : function(item){
        this.items.removeKey(item.id);
        item.destroy();
    },

    
    removeAll : function(){
        var f;
        while(f = this.items.first()){
            this.remove(f);
        }
    }
});

Wtf.menu.MenuNav = function(menu){
    Wtf.menu.MenuNav.superclass.constructor.call(this, menu.el);
    this.scope = this.menu = menu;
};

Wtf.extend(Wtf.menu.MenuNav, Wtf.KeyNav, {
    doRelay : function(e, h){
        var k = e.getKey();
        if(!this.menu.activeItem && e.isNavKeyPress() && k != e.SPACE && k != e.RETURN){
            this.menu.tryActivate(0, 1);
            return false;
        }
        return h.call(this.scope || this, e, this.menu);
    },

    up : function(e, m){
        if(!m.tryActivate(m.items.indexOf(m.activeItem)-1, -1)){
            m.tryActivate(m.items.length-1, -1);
        }
    },

    down : function(e, m){
        if(!m.tryActivate(m.items.indexOf(m.activeItem)+1, 1)){
            m.tryActivate(0, 1);
        }
    },

    right : function(e, m){
        if(m.activeItem){
            m.activeItem.expandMenu(true);
        }
    },

    left : function(e, m){
        m.hide();
        if(m.parentMenu && m.parentMenu.activeItem){
            m.parentMenu.activeItem.activate();
        }
    },

    enter : function(e, m){
        if(m.activeItem){
            e.stopPropagation();
            m.activeItem.onClick(e);
            m.fireEvent("click", this, m.activeItem);
            return true;
        }
    }
});

Wtf.menu.MenuMgr = function(){
   var menus, active, groups = {}, attached = false, lastShow = new Date();

      function init(){
       menus = {};
       active = new Wtf.util.MixedCollection();
       Wtf.getDoc().addKeyListener(27, function(){
           if(active.length > 0){
               hideAll();
           }
       });
   }

      function hideAll(){
       if(active && active.length > 0){
           var c = active.clone();
           c.each(function(m){
               m.hide();
           });
       }
   }

      function onHide(m){
       active.remove(m);
       if(active.length < 1){
           Wtf.getDoc().un("mousedown", onMouseDown);
           attached = false;
       }
   }

      function onShow(m){
       var last = active.last();
       lastShow = new Date();
       active.add(m);
       if(!attached){
           Wtf.getDoc().on("mousedown", onMouseDown);
           attached = true;
       }
       if(m.parentMenu){
          m.getEl().setZIndex(parseInt(m.parentMenu.getEl().getStyle("z-index"), 10) + 3);
          m.parentMenu.activeChild = m;
       }else if(last && last.isVisible()){
          m.getEl().setZIndex(parseInt(last.getEl().getStyle("z-index"), 10) + 3);
       }
   }

      function onBeforeHide(m){
       if(m.activeChild){
           m.activeChild.hide();
       }
       if(m.autoHideTimer){
           clearTimeout(m.autoHideTimer);
           delete m.autoHideTimer;
       }
   }

      function onBeforeShow(m){
       var pm = m.parentMenu;
       if(!pm && !m.allowOtherMenus){
           hideAll();
       }else if(pm && pm.activeChild){
           pm.activeChild.hide();
       }
   }

      function onMouseDown(e){
       if(lastShow.getElapsed() > 50 && active.length > 0 && !e.getTarget(".x-menu")){
           hideAll();
       }
   }

      function onBeforeCheck(mi, state){
       if(state){
           var g = groups[mi.group];
           for(var i = 0, l = g.length; i < l; i++){
               if(g[i] != mi){
                   g[i].setChecked(false);
               }
           }
       }
   }

   return {

       
       hideAll : function(){
            hideAll();  
       },

              register : function(menu){
           if(!menus){
               init();
           }
           menus[menu.id] = menu;
           menu.on("beforehide", onBeforeHide);
           menu.on("hide", onHide);
           menu.on("beforeshow", onBeforeShow);
           menu.on("show", onShow);
           var g = menu.group;
           if(g && menu.events["checkchange"]){
               if(!groups[g]){
                   groups[g] = [];
               }
               groups[g].push(menu);
               menu.on("checkchange", onCheck);
           }
       },

        
       get : function(menu){
           if(typeof menu == "string"){                return menus[menu];
           }else if(menu.events){                 return menu;
           }else if(typeof menu.length == 'number'){                return new Wtf.menu.Menu({items:menu});
           }else{                return new Wtf.menu.Menu(menu);
           }
       },

              unregister : function(menu){
           delete menus[menu.id];
           menu.un("beforehide", onBeforeHide);
           menu.un("hide", onHide);
           menu.un("beforeshow", onBeforeShow);
           menu.un("show", onShow);
           var g = menu.group;
           if(g && menu.events["checkchange"]){
               groups[g].remove(menu);
               menu.un("checkchange", onCheck);
           }
       },

              registerCheckable : function(menuItem){
           var g = menuItem.group;
           if(g){
               if(!groups[g]){
                   groups[g] = [];
               }
               groups[g].push(menuItem);
               menuItem.on("beforecheckchange", onBeforeCheck);
           }
       },

              unregisterCheckable : function(menuItem){
           var g = menuItem.group;
           if(g){
               groups[g].remove(menuItem);
               menuItem.un("beforecheckchange", onBeforeCheck);
           }
       },

       getCheckedItem : function(groupId){
           var g = groups[groupId];
           if(g){
               for(var i = 0, l = g.length; i < l; i++){
                   if(g[i].checked){
                       return g[i];
                   }
               }
           }
           return null;
       },

       setCheckedItem : function(groupId, itemId){
           var g = groups[groupId];
           if(g){
               for(var i = 0, l = g.length; i < l; i++){
                   if(g[i].id == itemId){
                       g[i].setChecked(true);
                   }
               }
           }
           return null;
       }
   };
}();


Wtf.menu.BaseItem = function(config){
    Wtf.menu.BaseItem.superclass.constructor.call(this, config);

    this.addEvents(
        
        'click',
        
        'activate',
        
        'deactivate'
    );

    if(this.handler){
        this.on("click", this.handler, this.scope);
    }
};

Wtf.extend(Wtf.menu.BaseItem, Wtf.Component, {
    
    
    
    canActivate : false,
    
    activeClass : "x-menu-item-active",
    
    hideOnClick : true,
    
    hideDelay : 100,

        ctype: "Wtf.menu.BaseItem",

        actionMode : "container",

        render : function(container, parentMenu){
        this.parentMenu = parentMenu;
        Wtf.menu.BaseItem.superclass.render.call(this, container);
        this.container.menuItemId = this.id;
    },

        onRender : function(container, position){
        this.el = Wtf.get(this.el);
        container.dom.appendChild(this.el.dom);
    },

    
    setHandler : function(handler, scope){
        if(this.handler){
            this.un("click", this.handler, this.scope);
        }
        this.on("click", this.handler = handler, this.scope = scope);
    },

        onClick : function(e){
        if(!this.disabled && this.fireEvent("click", this, e) !== false
                && this.parentMenu.fireEvent("itemclick", this, e) !== false){
            this.handleClick(e);
        }else{
            e.stopEvent();
        }
    },

        activate : function(){
        if(this.disabled){
            return false;
        }
        var li = this.container;
        li.addClass(this.activeClass);
        this.region = li.getRegion().adjust(2, 2, -2, -2);
        this.fireEvent("activate", this);
        return true;
    },

        deactivate : function(){
        this.container.removeClass(this.activeClass);
        this.fireEvent("deactivate", this);
    },

        shouldDeactivate : function(e){
        return !this.region || !this.region.contains(e.getPoint());
    },

        handleClick : function(e){
        if(this.hideOnClick){
            this.parentMenu.hide.defer(this.hideDelay, this.parentMenu, [true]);
        }
    },

        expandMenu : function(autoActivate){
            },

        hideMenu : function(){
            }
});

Wtf.menu.TextItem = function(text){
    this.text = text;
    Wtf.menu.TextItem.superclass.constructor.call(this);
};

Wtf.extend(Wtf.menu.TextItem, Wtf.menu.BaseItem, {
    
    
    hideOnClick : false,
    
    itemCls : "x-menu-text",

        onRender : function(){
        var s = document.createElement("span");
        s.className = this.itemCls;
        s.innerHTML = this.text;
        this.el = s;
        Wtf.menu.TextItem.superclass.onRender.apply(this, arguments);
    }
});

Wtf.menu.Separator = function(config){
    Wtf.menu.Separator.superclass.constructor.call(this, config);
};

Wtf.extend(Wtf.menu.Separator, Wtf.menu.BaseItem, {
    
    itemCls : "x-menu-sep",
    
    hideOnClick : false,

        onRender : function(li){
        var s = document.createElement("span");
        s.className = this.itemCls;
        s.innerHTML = "&#160;";
        this.el = s;
        li.addClass("x-menu-sep-li");
        Wtf.menu.Separator.superclass.onRender.apply(this, arguments);
    }
});

Wtf.menu.Item = function(config){
    Wtf.menu.Item.superclass.constructor.call(this, config);
    if(this.menu){
        this.menu = Wtf.menu.MenuMgr.get(this.menu);
    }
};
Wtf.extend(Wtf.menu.Item, Wtf.menu.BaseItem, {
    
    
    
    
    
    
    itemCls : "x-menu-item",
    
    canActivate : true,
    
    showDelay: 200,
        hideDelay: 200,

        ctype: "Wtf.menu.Item",

        onRender : function(container, position){
        var el = document.createElement("a");
        el.hideFocus = true;
        el.unselectable = "on";
        el.href = this.href || "#";
        if(this.hrefTarget){
            el.target = this.hrefTarget;
        }
        el.className = this.itemCls + (this.menu ?  " x-menu-item-arrow" : "") + (this.cls ?  " " + this.cls : "");
        el.innerHTML = String.format(
                '<img src="{0}" class="x-menu-item-icon {2}" />{1}',
                this.icon || Wtf.BLANK_IMAGE_URL, this.text, this.iconCls || '');
        this.el = el;
        Wtf.menu.Item.superclass.onRender.call(this, container, position);
    },

    
    setText : function(text){
        this.text = text;
        if(this.rendered){
            this.el.update(String.format(
                '<img src="{0}" class="x-menu-item-icon {2}">{1}',
                this.icon || Wtf.BLANK_IMAGE_URL, this.text, this.iconCls || ''));
            this.parentMenu.autoWidth();
        }
    },

    
    setIconClass : function(cls){
        var oldCls = this.iconCls;
        this.iconCls = cls;
        if(this.rendered){
            this.el.child('img.x-menu-item-icon').replaceClass(oldCls, this.iconCls);
        }
    },

        handleClick : function(e){
        if(!this.href){             e.stopEvent();
        }
        Wtf.menu.Item.superclass.handleClick.apply(this, arguments);
    },

        activate : function(autoExpand){
        if(Wtf.menu.Item.superclass.activate.apply(this, arguments)){
            this.focus();
            if(autoExpand){
                this.expandMenu();
            }
        }
        return true;
    },

        shouldDeactivate : function(e){
        if(Wtf.menu.Item.superclass.shouldDeactivate.call(this, e)){
            if(this.menu && this.menu.isVisible()){
                return !this.menu.getEl().getRegion().contains(e.getPoint());
            }
            return true;
        }
        return false;
    },

        deactivate : function(){
        Wtf.menu.Item.superclass.deactivate.apply(this, arguments);
        this.hideMenu();
    },

        expandMenu : function(autoActivate){
        if(!this.disabled && this.menu){
            clearTimeout(this.hideTimer);
            delete this.hideTimer;
            if(!this.menu.isVisible() && !this.showTimer){
                this.showTimer = this.deferExpand.defer(this.showDelay, this, [autoActivate]);
            }else if (this.menu.isVisible() && autoActivate){
                this.menu.tryActivate(0, 1);
            }
        }
    },

        deferExpand : function(autoActivate){
        delete this.showTimer;
        this.menu.show(this.container, this.parentMenu.subMenuAlign || "tl-tr?", this.parentMenu);
        if(autoActivate){
            this.menu.tryActivate(0, 1);
        }
    },

        hideMenu : function(){
        clearTimeout(this.showTimer);
        delete this.showTimer;
        if(!this.hideTimer && this.menu && this.menu.isVisible()){
            this.hideTimer = this.deferHide.defer(this.hideDelay, this);
        }
    },

        deferHide : function(){
        delete this.hideTimer;
        this.menu.hide();
    }
});

Wtf.menu.CheckItem = function(config){
    Wtf.menu.CheckItem.superclass.constructor.call(this, config);
    this.addEvents(
        
        "beforecheckchange" ,
        
        "checkchange"
    );
    
    if(this.checkHandler){
        this.on('checkchange', this.checkHandler, this.scope);
    }
    Wtf.menu.MenuMgr.registerCheckable(this);
};
Wtf.extend(Wtf.menu.CheckItem, Wtf.menu.Item, {
    
    
    itemCls : "x-menu-item x-menu-check-item",
    
    groupClass : "x-menu-group-item",

    
    checked: false,

        ctype: "Wtf.menu.CheckItem",

        onRender : function(c){
        Wtf.menu.CheckItem.superclass.onRender.apply(this, arguments);
        if(this.group){
            this.el.addClass(this.groupClass);
        }
        if(this.checked){
            this.checked = false;
            this.setChecked(true, true);
        }
    },

        destroy : function(){
        Wtf.menu.MenuMgr.unregisterCheckable(this);
        Wtf.menu.CheckItem.superclass.destroy.apply(this, arguments);
    },

    
    setChecked : function(state, suppressEvent){
        if(this.checked != state && this.fireEvent("beforecheckchange", this, state) !== false){
            if(this.container){
                this.container[state ? "addClass" : "removeClass"]("x-menu-item-checked");
            }
            this.checked = state;
            if(suppressEvent !== true){
                this.fireEvent("checkchange", this, state);
            }
        }
    },

        handleClick : function(e){
       if(!this.disabled && !(this.checked && this.group)){           this.setChecked(!this.checked);
       }
       Wtf.menu.CheckItem.superclass.handleClick.apply(this, arguments);
    }
});

Wtf.menu.Adapter = function(component, config){
    Wtf.menu.Adapter.superclass.constructor.call(this, config);
    this.component = component;
};
Wtf.extend(Wtf.menu.Adapter, Wtf.menu.BaseItem, {
        canActivate : true,

        onRender : function(container, position){
        this.component.render(container);
        this.el = this.component.getEl();
    },

        activate : function(){
        if(this.disabled){
            return false;
        }
        this.component.focus();
        this.fireEvent("activate", this);
        return true;
    },

        deactivate : function(){
        this.fireEvent("deactivate", this);
    },

        disable : function(){
        this.component.disable();
        Wtf.menu.Adapter.superclass.disable.call(this);
    },

        enable : function(){
        this.component.enable();
        Wtf.menu.Adapter.superclass.enable.call(this);
    }
});

Wtf.menu.DateItem = function(config){
    Wtf.menu.DateItem.superclass.constructor.call(this, new Wtf.DatePicker(config), config);
    
    this.picker = this.component;
    this.addEvents('select');
    
    this.picker.on("render", function(picker){
        picker.getEl().swallowEvent("click");
        picker.container.addClass("x-menu-date-item");
    });

    this.picker.on("select", this.onSelect, this);
};

Wtf.extend(Wtf.menu.DateItem, Wtf.menu.Adapter, {
        onSelect : function(picker, date){
        this.fireEvent("select", this, date, picker);
        Wtf.menu.DateItem.superclass.handleClick.call(this);
    }
});

Wtf.menu.ColorItem = function(config){
    Wtf.menu.ColorItem.superclass.constructor.call(this, new Wtf.ColorPalette(config), config);
    
    this.palette = this.component;
    this.relayEvents(this.palette, ["select"]);
    if(this.selectHandler){
        this.on('select', this.selectHandler, this.scope);
    }
};
Wtf.extend(Wtf.menu.ColorItem, Wtf.menu.Adapter);

Wtf.menu.DateMenu = function(config){
    Wtf.menu.DateMenu.superclass.constructor.call(this, config);
    this.plain = true;
    var di = new Wtf.menu.DateItem(config);
    this.add(di);
    
    this.picker = di.picker;
    
    this.relayEvents(di, ["select"]);

    this.on('beforeshow', function(){
        if(this.picker){
            this.picker.hideMonthPicker(true);
        }
    }, this);
};
Wtf.extend(Wtf.menu.DateMenu, Wtf.menu.Menu, {
    cls:'x-date-menu'
});

Wtf.menu.ColorMenu = function(config){
    Wtf.menu.ColorMenu.superclass.constructor.call(this, config);
    this.plain = true;
    var ci = new Wtf.menu.ColorItem(config);
    this.add(ci);
    
    this.palette = ci.palette;
    
    this.relayEvents(ci, ["select"]);
};
Wtf.extend(Wtf.menu.ColorMenu, Wtf.menu.Menu);

Wtf.form.Field = Wtf.extend(Wtf.BoxComponent,  {
    
    
    
    
    
    

    
    invalidClass : "x-form-invalid",
    
    invalidText : "The value in this field is invalid",
    
    focusClass : "x-form-focus",
    
    validationEvent : "keyup",
    
    validateOnBlur : true,
    
    validationDelay : 250,
    
    defaultAutoCreate : {tag: "input", type: "text", size: "20", autocomplete: "off"},
    
    fieldClass : "x-form-field",
    
    msgTarget : 'qtip',
    
    msgFx : 'normal',
    
    
    readOnly : false,

    
    disabled : false,

    

    

        isFormField : true,

        hasFocus : false,

    
    
    
    

		initComponent : function(){
        Wtf.form.Field.superclass.initComponent.call(this);
        this.addEvents(
            
            'focus',
            
            'blur',
            
            'specialkey',
            
            'change',
            
            'invalid',
            
            'valid'
        );
    },

    
    getName: function(){
         return this.rendered && this.el.dom.name ? this.el.dom.name : (this.hiddenName || '');
    },

        onRender : function(ct, position){
        Wtf.form.Field.superclass.onRender.call(this, ct, position);
        if(!this.el){
            var cfg = this.getAutoCreate();
            if(!cfg.name){
                cfg.name = this.name || this.id;
            }
            if(this.inputType){
                cfg.type = this.inputType;
            }
            this.el = ct.createChild(cfg, position);
        }
        var type = this.el.dom.type;
        if(type){
            if(type == 'password'){
                type = 'text';
            }
            this.el.addClass('x-form-'+type);
        }
        if(this.readOnly){
            this.el.dom.readOnly = true;
        }
        if(this.tabIndex !== undefined){
            this.el.dom.setAttribute('tabIndex', this.tabIndex);
        }

        this.el.addClass([this.fieldClass, this.cls]);
        this.initValue();
    },

        initValue : function(){
        if(this.value !== undefined){
            this.setValue(this.value);
        }else if(this.el.dom.value.length > 0){
            this.setValue(this.el.dom.value);
        }
    },

    
    isDirty : function() {
        if(this.disabled) {
            return false;
        }
        return String(this.getValue()) !== String(this.originalValue);
    },

        afterRender : function(){
        Wtf.form.Field.superclass.afterRender.call(this);
        this.initEvents();
    },

        fireKey : function(e){
        if(e.isSpecialKey()){
            this.fireEvent("specialkey", this, e);
        }
    },

    
    reset : function(){
        this.setValue(this.originalValue);
        this.clearInvalid();
    },

        initEvents : function(){
        this.el.on(Wtf.isIE ? "keydown" : "keypress", this.fireKey,  this);
        this.el.on("focus", this.onFocus,  this);
        this.el.on("blur", this.onBlur,  this);

                this.originalValue = this.getValue();
    },

        onFocus : function(){
        if(!Wtf.isOpera && this.focusClass){             this.el.addClass(this.focusClass);
        }
        if(!this.hasFocus){
            this.hasFocus = true;
            this.startValue = this.getValue();
            this.fireEvent("focus", this);
        }
    },

    beforeBlur : Wtf.emptyFn,

        onBlur : function(){
        this.beforeBlur();
        if(!Wtf.isOpera && this.focusClass){             this.el.removeClass(this.focusClass);
        }
        this.hasFocus = false;
        if(this.validationEvent !== false && this.validateOnBlur && this.validationEvent != "blur"){
            this.validate();
        }
        var v = this.getValue();
        if(String(v) !== String(this.startValue)){
            this.fireEvent('change', this, v, this.startValue);
        }
        this.fireEvent("blur", this);
    },

    
    isValid : function(preventMark){
        if(this.disabled){
            return true;
        }
        var restore = this.preventMark;
        this.preventMark = preventMark === true;
        var v = this.validateValue(this.processValue(this.getRawValue()));
        this.preventMark = restore;
        return v;
    },

    
    validate : function(){
        if(this.disabled || this.validateValue(this.processValue(this.getRawValue()))){
            this.clearInvalid();
            return true;
        }
        return false;
    },

    processValue : function(value){
        return value;
    },

            validateValue : function(value){
        return true;
    },

    
    markInvalid : function(msg){
        if(!this.rendered || this.preventMark){             return;
        }
        this.el.addClass(this.invalidClass);
        msg = msg || this.invalidText;
        switch(this.msgTarget){
            case 'qtip':
                this.el.dom.qtip = msg;
                this.el.dom.qclass = 'x-form-invalid-tip';
                if(Wtf.QuickTips){                     Wtf.QuickTips.enable();
                }
                break;
            case 'title':
                this.el.dom.title = msg;
                break;
            case 'under':
                if(!this.errorEl){
                    var elp = this.el.findParent('.x-form-element', 5, true);
                    this.errorEl = elp.createChild({cls:'x-form-invalid-msg'});
                    this.errorEl.setWidth(elp.getWidth(true)-20);
                }
                this.errorEl.update(msg);
                Wtf.form.Field.msgFx[this.msgFx].show(this.errorEl, this);
                break;
            case 'side':
                if(!this.errorIcon){
                    var elp = this.el.findParent('.x-form-element', 5, true);
                    this.errorIcon = elp.createChild({cls:'x-form-invalid-icon'});
                }
                this.alignErrorIcon();
                this.errorIcon.dom.qtip = msg;
                this.errorIcon.dom.qclass = 'x-form-invalid-tip';
                this.errorIcon.show();
                this.on('resize', this.alignErrorIcon, this);
                break;
            default:
                var t = Wtf.getDom(this.msgTarget);
                t.innerHTML = msg;
                t.style.display = this.msgDisplay;
                break;
        }
        this.fireEvent('invalid', this, msg);
    },

        alignErrorIcon : function(){
        this.errorIcon.alignTo(this.el, 'tl-tr', [2, 0]);
    },

    
    clearInvalid : function(){
        if(!this.rendered || this.preventMark){             return;
        }
        this.el.removeClass(this.invalidClass);
        switch(this.msgTarget){
            case 'qtip':
                this.el.dom.qtip = '';
                break;
            case 'title':
                this.el.dom.title = '';
                break;
            case 'under':
                if(this.errorEl){
                    Wtf.form.Field.msgFx[this.msgFx].hide(this.errorEl, this);
                }
                break;
            case 'side':
                if(this.errorIcon){
                    this.errorIcon.dom.qtip = '';
                    this.errorIcon.hide();
                    this.un('resize', this.alignErrorIcon, this);
                }
                break;
            default:
                var t = Wtf.getDom(this.msgTarget);
                t.innerHTML = '';
                t.style.display = 'none';
                break;
        }
        this.fireEvent('valid', this);
    },

    
    getRawValue : function(){
        var v = this.rendered ? this.el.getValue() : Wtf.value(this.value, '');
        if(v === this.emptyText){
            v = '';
        }
        return v;
    },

    
    getValue : function(){
        if(!this.rendered) {
            return this.value;
        }
        var v = this.el.getValue();
        if(v === this.emptyText || v === undefined){
            v = '';
        }
        return v;
    },

    
    setRawValue : function(v){
        return this.el.dom.value = (v === null || v === undefined ? '' : v);
    },

    
    setValue : function(v){
        this.value = v;
        if(this.rendered){
            this.el.dom.value = (v === null || v === undefined ? '' : v);
            this.validate();
        }
    },

    adjustSize : function(w, h){
        var s = Wtf.form.Field.superclass.adjustSize.call(this, w, h);
        s.width = this.adjustWidth(this.el.dom.tagName, s.width);
        return s;
    },

    adjustWidth : function(tag, w){
        tag = tag.toLowerCase();
        if(typeof w == 'number' && !Wtf.isSafari){
            if(Wtf.isIE && (tag == 'input' || tag == 'textarea')){
                if(tag == 'input' && !Wtf.isStrict){
                    return w - 3;
                }
                if(tag == 'input' && Wtf.isStrict){
                    return w - (Wtf.isIE6 ? 4 : 1);
                }
                if(tag = 'textarea' && Wtf.isStrict){
                    return w-2;
                }
            }else if(Wtf.isOpera && Wtf.isStrict){
                if(tag == 'input'){
                    return w + 2;
                }
                if(tag = 'textarea'){
                    return w-2;
                }
            }
        }
        return w;
    }
});


Wtf.form.Field.msgFx = {
    normal : {
        show: function(msgEl, f){
            msgEl.setDisplayed('block');
        },

        hide : function(msgEl, f){
            msgEl.setDisplayed(false).update('');
        }
    },

    slide : {
        show: function(msgEl, f){
            msgEl.slideIn('t', {stopFx:true});
        },

        hide : function(msgEl, f){
            msgEl.slideOut('t', {stopFx:true,useDisplay:true});
        }
    },

    slideRight : {
        show: function(msgEl, f){
            msgEl.fixDisplay();
            msgEl.alignTo(f.el, 'tl-tr');
            msgEl.slideIn('l', {stopFx:true});
        },

        hide : function(msgEl, f){
            msgEl.slideOut('l', {stopFx:true,useDisplay:true});
        }
    }
};
Wtf.reg('field', Wtf.form.Field);


Wtf.form.TextField = Wtf.extend(Wtf.form.Field,  {
    
    
    grow : false,
    
    growMin : 30,
    
    growMax : 800,
    
    vtype : null,
    
    maskRe : null,
    
    disableKeyFilter : false,
    
    allowBlank : true,
    
    minLength : 0,
    
    maxLength : Number.MAX_VALUE,
    
    minLengthText : "The minimum length for this field is {0}",
    
    maxLengthText : "The maximum length for this field is {0}",
    
    selectOnFocus : false,
    
    blankText : "This field is required",
    
    validator : null,
    
    regex : null,
    
    regexText : "",
    
    emptyText : null,
    
    emptyClass : 'x-form-empty-field',

    initComponent : function(){
        Wtf.form.TextField.superclass.initComponent.call(this);
        this.addEvents(
            
            'autosize'
        );
    },

        initEvents : function(){
        Wtf.form.TextField.superclass.initEvents.call(this);
        if(this.validationEvent == 'keyup'){
            this.validationTask = new Wtf.util.DelayedTask(this.validate, this);
            this.el.on('keyup', this.filterValidation, this);
        }
        else if(this.validationEvent !== false){
            this.el.on(this.validationEvent, this.validate, this, {buffer: this.validationDelay});
        }
        if(this.selectOnFocus || this.emptyText){
            this.on("focus", this.preFocus, this);
            if(this.emptyText){
                this.on('blur', this.postBlur, this);
                this.applyEmptyText();
            }
        }
        if(this.maskRe || (this.vtype && this.disableKeyFilter !== true && (this.maskRe = Wtf.form.VTypes[this.vtype+'Mask']))){
            this.el.on("keypress", this.filterKeys, this);
        }
        if(this.grow){
            this.el.on("keyup", this.onKeyUp,  this, {buffer:50});
            this.el.on("click", this.autoSize,  this);
        }
    },

    processValue : function(value){
        if(this.stripCharsRe){
            var newValue = value.replace(this.stripCharsRe, '');
            if(newValue !== value){
                this.setRawValue(newValue);
                return newValue;
            }
        }
        return value;
    },

    filterValidation : function(e){
        if(!e.isNavKeyPress()){
            this.validationTask.delay(this.validationDelay);
        }
    },

        onKeyUp : function(e){
        if(!e.isNavKeyPress()){
            this.autoSize();
        }
    },

    
    reset : function(){
        Wtf.form.TextField.superclass.reset.call(this);
        this.applyEmptyText();
    },

    applyEmptyText : function(){
        if(this.rendered && this.emptyText && this.getRawValue().length < 1){
            this.setRawValue(this.emptyText);
            this.el.addClass(this.emptyClass);
        }
    },

        preFocus : function(){
        if(this.emptyText){
            if(this.el.dom.value == this.emptyText){
                this.setRawValue('');
            }
            this.el.removeClass(this.emptyClass);
        }
        if(this.selectOnFocus){
            this.el.dom.select();
        }
    },

        postBlur : function(){
        this.applyEmptyText();
    },

        filterKeys : function(e){
        var k = e.getKey();
        if(!Wtf.isIE && (e.isNavKeyPress() || k == e.BACKSPACE || (k == e.DELETE && e.button == -1))){
            return;
        }
        var c = e.getCharCode(), cc = String.fromCharCode(c);
        if(Wtf.isIE && (e.isSpecialKey() || !cc)){
            return;
        }
        if(!this.maskRe.test(cc)){
            e.stopEvent();
        }
    },

    setValue : function(v){
        if(this.emptyText && this.el && v !== undefined && v !== null && v !== ''){
            this.el.removeClass(this.emptyClass);
        }
        Wtf.form.TextField.superclass.setValue.apply(this, arguments);
        this.applyEmptyText();
        this.autoSize();
    },

    
    validateValue : function(value){
        if(value.length < 1 || value === this.emptyText){              if(this.allowBlank){
                 this.clearInvalid();
                 return true;
             }else{
                 this.markInvalid(this.blankText);
                 return false;
             }
        }
        if(value.length < this.minLength){
            this.markInvalid(String.format(this.minLengthText, this.minLength));
            return false;
        }
        if(value.length > this.maxLength){
            this.markInvalid(String.format(this.maxLengthText, this.maxLength));
            return false;
        }
        if(this.vtype){
            var vt = Wtf.form.VTypes;
            if(!vt[this.vtype](value, this)){
                this.markInvalid(this.vtypeText || vt[this.vtype +'Text']);
                return false;
            }
        }
        if(typeof this.validator == "function"){
            var msg = this.validator(value);
            if(msg !== true){
                this.markInvalid(msg);
                return false;
            }
        }
        if(this.regex && !this.regex.test(value)){
            this.markInvalid(this.regexText);
            return false;
        }
        return true;
    },

    
    selectText : function(start, end){
        var v = this.getRawValue();
        if(v.length > 0){
            start = start === undefined ? 0 : start;
            end = end === undefined ? v.length : end;
            var d = this.el.dom;
            if(d.setSelectionRange){
                d.setSelectionRange(start, end);
            }else if(d.createTextRange){
                var range = d.createTextRange();
                range.moveStart("character", start);
                range.moveEnd("character", v.length-end);
                range.select();
            }
        }
    },

    
    autoSize : function(){
        if(!this.grow || !this.rendered){
            return;
        }
        if(!this.metrics){
            this.metrics = Wtf.util.TextMetrics.createInstance(this.el);
        }
        var el = this.el;
        var v = el.dom.value;
        var d = document.createElement('div');
        d.appendChild(document.createTextNode(v));
        v = d.innerHTML;
        d = null;
        v += "&#160;";
        var w = Math.min(this.growMax, Math.max(this.metrics.getWidth(v) +  10, this.growMin));
        this.el.setWidth(w);
        this.fireEvent("autosize", this, w);
    }
});
Wtf.reg('textfield', Wtf.form.TextField);


Wtf.form.TriggerField = Wtf.extend(Wtf.form.TextField,  {
    
    
    defaultAutoCreate : {tag: "input", type: "text", size: "16", autocomplete: "off"},
    
    hideTrigger:false,

    
    autoSize: Wtf.emptyFn,
        monitorTab : true,
        deferHeight : true,
        mimicing : false,

        onResize : function(w, h){
        Wtf.form.TriggerField.superclass.onResize.call(this, w, h);
        if(typeof w == 'number'){
            this.el.setWidth(this.adjustWidth('input', w - this.trigger.getWidth()));
        }
        this.wrap.setWidth(this.el.getWidth()+this.trigger.getWidth());
    },

        adjustSize : Wtf.BoxComponent.prototype.adjustSize,

        getResizeEl : function(){
        return this.wrap;
    },

        getPositionEl : function(){
        return this.wrap;
    },

        alignErrorIcon : function(){
        this.errorIcon.alignTo(this.wrap, 'tl-tr', [2, 0]);
    },

        onRender : function(ct, position){
        Wtf.form.TriggerField.superclass.onRender.call(this, ct, position);
        this.wrap = this.el.wrap({cls: "x-form-field-wrap"});
        this.trigger = this.wrap.createChild(this.triggerConfig ||
                {tag: "img", src: Wtf.BLANK_IMAGE_URL, cls: "x-form-trigger " + this.triggerClass});
        if(this.hideTrigger){
            this.trigger.setDisplayed(false);
        }
        this.initTrigger();
        if(!this.width){
            this.wrap.setWidth(this.el.getWidth()+this.trigger.getWidth());
        }
    },

        initTrigger : function(){
        this.trigger.on("click", this.onTriggerClick, this, {preventDefault:true});
        this.trigger.addClassOnOver('x-form-trigger-over');
        this.trigger.addClassOnClick('x-form-trigger-click');
    },

        onDestroy : function(){
        if(this.trigger){
            this.trigger.removeAllListeners();
            this.trigger.remove();
        }
        if(this.wrap){
            this.wrap.remove();
        }
        Wtf.form.TriggerField.superclass.onDestroy.call(this);
    },

        onFocus : function(){
        Wtf.form.TriggerField.superclass.onFocus.call(this);
        if(!this.mimicing){
            this.wrap.addClass('x-trigger-wrap-focus');
            this.mimicing = true;
            Wtf.get(Wtf.isIE ? document.body : document).on("mousedown", this.mimicBlur, this, {delay: 10});
            if(this.monitorTab){
                this.el.on("keydown", this.checkTab, this);
            }
        }
    },

        checkTab : function(e){
        if(e.getKey() == e.TAB){
            this.triggerBlur();
        }
    },

        onBlur : function(){
            },

        mimicBlur : function(e){
        if(!this.wrap.contains(e.target) && this.validateBlur(e)){
            this.triggerBlur();
        }
    },

        triggerBlur : function(){
        this.mimicing = false;
        Wtf.get(Wtf.isIE ? document.body : document).un("mousedown", this.mimicBlur);
        if(this.monitorTab){
            this.el.un("keydown", this.checkTab, this);
        }
        this.beforeBlur();
        this.wrap.removeClass('x-trigger-wrap-focus');
        Wtf.form.TriggerField.superclass.onBlur.call(this);
    },

    beforeBlur : Wtf.emptyFn, 

            validateBlur : function(e){
        return true;
    },

        onDisable : function(){
        Wtf.form.TriggerField.superclass.onDisable.call(this);
        if(this.wrap){
            this.wrap.addClass('x-item-disabled');
        }
    },

        onEnable : function(){
        Wtf.form.TriggerField.superclass.onEnable.call(this);
        if(this.wrap){
            this.wrap.removeClass('x-item-disabled');
        }
    },


        onShow : function(){
        if(this.wrap){
            this.wrap.dom.style.display = '';
            this.wrap.dom.style.visibility = 'visible';
        }
    },

        onHide : function(){
        this.wrap.dom.style.display = 'none';
    },

    
    onTriggerClick : Wtf.emptyFn

    
    
    
});

Wtf.form.TwinTriggerField = Wtf.extend(Wtf.form.TriggerField, {
    initComponent : function(){
        Wtf.form.TwinTriggerField.superclass.initComponent.call(this);

        this.triggerConfig = {
            tag:'span', cls:'x-form-twin-triggers', cn:[
            {tag: "img", src: Wtf.BLANK_IMAGE_URL, cls: "x-form-trigger " + this.trigger1Class},
            {tag: "img", src: Wtf.BLANK_IMAGE_URL, cls: "x-form-trigger " + this.trigger2Class}
        ]};
    },

    getTrigger : function(index){
        return this.triggers[index];
    },

    initTrigger : function(){
        var ts = this.trigger.select('.x-form-trigger', true);
        this.wrap.setStyle('overflow', 'hidden');
        var triggerField = this;
        ts.each(function(t, all, index){
            t.hide = function(){
                var w = triggerField.wrap.getWidth();
                this.dom.style.display = 'none';
                triggerField.el.setWidth(w-triggerField.trigger.getWidth());
            };
            t.show = function(){
                var w = triggerField.wrap.getWidth();
                this.dom.style.display = '';
                triggerField.el.setWidth(w-triggerField.trigger.getWidth());
            };
            var triggerIndex = 'Trigger'+(index+1);

            if(this['hide'+triggerIndex]){
                t.dom.style.display = 'none';
            }
            t.on("click", this['on'+triggerIndex+'Click'], this, {preventDefault:true});
            t.addClassOnOver('x-form-trigger-over');
            t.addClassOnClick('x-form-trigger-click');
        }, this);
        this.triggers = ts.elements;
    },

    onTrigger1Click : Wtf.emptyFn,
    onTrigger2Click : Wtf.emptyFn
});
Wtf.reg('trigger', Wtf.form.TriggerField);

Wtf.form.TextArea = Wtf.extend(Wtf.form.TextField,  {
    
    growMin : 60,
    
    growMax: 1000,
    growAppend : '&#160;\n&#160;',
    growPad : 0,

    enterIsSpecial : false,

    
    preventScrollbars: false,
    

        onRender : function(ct, position){
        if(!this.el){
            this.defaultAutoCreate = {
                tag: "textarea",
                style:"width:100px;height:60px;",
                autocomplete: "off"
            };
        }
        Wtf.form.TextArea.superclass.onRender.call(this, ct, position);
        if(this.grow){
            this.textSizeEl = Wtf.DomHelper.append(document.body, {
                tag: "pre", cls: "x-form-grow-sizer"
            });
            if(this.preventScrollbars){
                this.el.setStyle("overflow", "hidden");
            }
            this.el.setHeight(this.growMin);
        }
    },

    onDestroy : function(){
        if(this.textSizeEl){
            Wtf.removeNode(this.textSizeEl);
        }
        Wtf.form.TextArea.superclass.onDestroy.call(this);
    },

    fireKey : function(e){
        if(e.isSpecialKey() && (this.enterIsSpecial || (e.getKey() != e.ENTER || e.hasModifier()))){
            this.fireEvent("specialkey", this, e);
        }
    },

        onKeyUp : function(e){
        if(!e.isNavKeyPress() || e.getKey() == e.ENTER){
            this.autoSize();
        }
    },

    
    autoSize : function(){
        if(!this.grow || !this.textSizeEl){
            return;
        }
        var el = this.el;
        var v = el.dom.value;
        var ts = this.textSizeEl;
        ts.innerHTML = '';
        ts.appendChild(document.createTextNode(v));
        v = ts.innerHTML;

        Wtf.fly(ts).setWidth(this.el.getWidth());
        if(v.length < 1){
            v = "&#160;&#160;";
        }else{
            if(Wtf.isIE){
                v = v.replace(/\n/g, '<p>&#160;</p>');
            }
            v += this.growAppend;
        }
        ts.innerHTML = v;
        var h = Math.min(this.growMax, Math.max(ts.offsetHeight, this.growMin)+this.growPad);
        if(h != this.lastHeight){
            this.lastHeight = h;
            this.el.setHeight(h);
            this.fireEvent("autosize", this, h);
        }
    }
});
Wtf.reg('textarea', Wtf.form.TextArea);

Wtf.form.NumberField = Wtf.extend(Wtf.form.TextField,  {
    
    fieldClass: "x-form-field x-form-num-field",
    
    allowDecimals : true,
    
    decimalSeparator : ".",
    
    decimalPrecision : 2,
    
    allowNegative : true,
    
    minValue : Number.NEGATIVE_INFINITY,
    
    maxValue : Number.MAX_VALUE,
    
    minText : "The minimum value for this field is {0}",
    
    maxText : "The maximum value for this field is {0}",
    
    nanText : "{0} is not a valid number",
    
    baseChars : "0123456789",

        initEvents : function(){
        Wtf.form.NumberField.superclass.initEvents.call(this);
        var allowed = this.baseChars+'';
        if(this.allowDecimals){
            allowed += this.decimalSeparator;
        }
        if(this.allowNegative){
            allowed += "-";
        }
        this.stripCharsRe = new RegExp('[^'+allowed+']', 'gi');
        var keyPress = function(e){
            var k = e.getKey();
            if(!Wtf.isIE && (e.isSpecialKey() || k == e.BACKSPACE || k == e.DELETE)){
                return;
            }
            var c = e.getCharCode();
            if(allowed.indexOf(String.fromCharCode(c)) === -1){
                e.stopEvent();
            }
        };
        this.el.on("keypress", keyPress, this);
    },

        validateValue : function(value){
        if(!Wtf.form.NumberField.superclass.validateValue.call(this, value)){
            return false;
        }
        if(value.length < 1){              return true;
        }
        value = String(value).replace(this.decimalSeparator, ".");
        if(isNaN(value)){
            this.markInvalid(String.format(this.nanText, value));
            return false;
        }
        var num = this.parseValue(value);
        if(num < this.minValue){
            this.markInvalid(String.format(this.minText, this.minValue));
            return false;
        }
        if(num > this.maxValue){
            this.markInvalid(String.format(this.maxText, this.maxValue));
            return false;
        }
        return true;
    },

    getValue : function(){
        return this.fixPrecision(this.parseValue(Wtf.form.NumberField.superclass.getValue.call(this)));
    },

    setValue : function(v){
        Wtf.form.NumberField.superclass.setValue.call(this, String(parseFloat(v)).replace(".", this.decimalSeparator));
    },

        parseValue : function(value){
        value = parseFloat(String(value).replace(this.decimalSeparator, "."));
        return isNaN(value) ? '' : value;
    },

        fixPrecision : function(value){
        var nan = isNaN(value);
        if(!this.allowDecimals || this.decimalPrecision == -1 || nan || !value){
           return nan ? '' : value;
        }
        return parseFloat(parseFloat(value).toFixed(this.decimalPrecision));
    },

    beforeBlur : function(){
        var v = this.parseValue(this.getRawValue());
        if(v){
            this.setValue(this.fixPrecision(v));
        }
    }
});
Wtf.reg('numberfield', Wtf.form.NumberField);

Wtf.form.DateField = Wtf.extend(Wtf.form.TriggerField,  {
    
    format : "m/d/y",
    
    altFormats : "m/d/Y|m-d-y|m-d-Y|m/d|m-d|md|mdy|mdY|d|Y-m-d",
    
    disabledDays : null,
    
    disabledDaysText : "Disabled",
    
    disabledDates : null,
    
    disabledDatesText : "Disabled",
    
    minValue : null,
    
    maxValue : null,
    
    minText : "The date in this field must be equal to or after {0}",
    
    maxText : "The date in this field must be equal to or before {0}",
    
    invalidText : "{0} is not a valid date - it must be in the format {1}",
    
    triggerClass : 'x-form-date-trigger',
    

        defaultAutoCreate : {tag: "input", type: "text", size: "10", autocomplete: "off"},

    initComponent : function(){
        Wtf.form.DateField.superclass.initComponent.call(this);
        if(typeof this.minValue == "string"){
            this.minValue = this.parseDate(this.minValue);
        }
        if(typeof this.maxValue == "string"){
            this.maxValue = this.parseDate(this.maxValue);
        }
        this.ddMatch = null;
        if(this.disabledDates){
            var dd = this.disabledDates;
            var re = "(?:";
            for(var i = 0; i < dd.length; i++){
                re += dd[i];
                if(i != dd.length-1) re += "|";
            }
            this.ddMatch = new RegExp(re + ")");
        }
    },

        validateValue : function(value){
        value = this.formatDate(value);
        if(!Wtf.form.DateField.superclass.validateValue.call(this, value)){
            return false;
        }
        if(value.length < 1){              return true;
        }
        var svalue = value;
        value = this.parseDate(value);
        if(!value){
            this.markInvalid(String.format(this.invalidText, svalue, this.format));
            return false;
        }
        var time = value.getTime();
        if(this.minValue && time < this.minValue.getTime()){
            this.markInvalid(String.format(this.minText, this.formatDate(this.minValue)));
            return false;
        }
        if(this.maxValue && time > this.maxValue.getTime()){
            this.markInvalid(String.format(this.maxText, this.formatDate(this.maxValue)));
            return false;
        }
        if(this.disabledDays){
            var day = value.getDay();
            for(var i = 0; i < this.disabledDays.length; i++) {
            	if(day === this.disabledDays[i]){
            	    this.markInvalid(this.disabledDaysText);
                    return false;
            	}
            }
        }
        var fvalue = this.formatDate(value);
        if(this.ddMatch && this.ddMatch.test(fvalue)){
            this.markInvalid(String.format(this.disabledDatesText, fvalue));
            return false;
        }
        return true;
    },

            validateBlur : function(){
        return !this.menu || !this.menu.isVisible();
    },

    
    getValue : function(){
        return this.parseDate(Wtf.form.DateField.superclass.getValue.call(this)) || "";
    },

    
    setValue : function(date){
        Wtf.form.DateField.superclass.setValue.call(this, this.formatDate(this.parseDate(date)));
    },

        parseDate : function(value){
        if(!value || value instanceof Date){
            return value;
        }
        var v = Date.parseDate(value, this.format);
        if(!v && this.altFormats){
            if(!this.altFormatsArray){
                this.altFormatsArray = this.altFormats.split("|");
            }
            for(var i = 0, len = this.altFormatsArray.length; i < len && !v; i++){
                v = Date.parseDate(value, this.altFormatsArray[i]);
            }
        }
        return v;
    },

        onDestroy : function(){
        if(this.wrap){
            this.wrap.remove();
        }
        Wtf.form.DateField.superclass.onDestroy.call(this);
    },

        formatDate : function(date){
        return (!date || !(date instanceof Date)) ?
               date : date.dateFormat(this.format);
    },

        menuListeners : {
        select: function(m, d){
            this.setValue(d);
        },
        show : function(){             this.onFocus();
        },
        hide : function(){
            this.focus.defer(10, this);
            var ml = this.menuListeners;
            this.menu.un("select", ml.select,  this);
            this.menu.un("show", ml.show,  this);
            this.menu.un("hide", ml.hide,  this);
        }
    },

            onTriggerClick : function(){
        if(this.disabled){
            return;
        }
        if(this.menu == null){
            this.menu = new Wtf.menu.DateMenu();
        }
        Wtf.apply(this.menu.picker,  {
            minDate : this.minValue,
            maxDate : this.maxValue,
            disabledDatesRE : this.ddMatch,
            disabledDatesText : this.disabledDatesText,
            disabledDays : this.disabledDays,
            disabledDaysText : this.disabledDaysText,
            format : this.format,
            minText : String.format(this.minText, this.formatDate(this.minValue)),
            maxText : String.format(this.maxText, this.formatDate(this.maxValue))
        });
        this.menu.on(Wtf.apply({}, this.menuListeners, {
            scope:this
        }));
        this.menu.picker.setValue(this.getValue() || new Date());
        this.menu.show(this.el, "tl-bl?");
    },

    beforeBlur : function(){
        var v = this.parseDate(this.getRawValue());
        if(v){
            this.setValue(v);
        }
    }

    
    
    
    
});
Wtf.reg('datefield', Wtf.form.DateField);

Wtf.form.ComboBox = Wtf.extend(Wtf.form.TriggerField, {
    
    
    
    
    
    
        defaultAutoCreate : {tag: "input", type: "text", size: "24", autocomplete: "off"},
    
    
    
    
    
    listClass: '',
    
    selectedClass: 'x-combo-selected',
    
    triggerClass : 'x-form-arrow-trigger',
    
    shadow:'sides',
    
    listAlign: 'tl-bl?',
    
    maxHeight: 300,
    
    triggerAction: 'query',
    
    minChars : 4,
    
    typeAhead: false,
    
    queryDelay: 500,
    
    pageSize: 0,
    
    selectOnFocus:false,
    
    queryParam: 'query',
    
    loadingText: 'Loading...',
    
    resizable: false,
    
    handleHeight : 8,
    
    editable: true,
    
    allQuery: '',
    
    mode: 'remote',
    
    minListWidth : 70,
    
    forceSelection:false,
    
    typeAheadDelay : 250,
    
    
    
    lazyInit : true,

    initComponent : function(){
        Wtf.form.ComboBox.superclass.initComponent.call(this);
        this.addEvents(
            
            'expand',
            
            'collapse',
            
            'beforeselect',
            
            'select',
            
            'beforequery'
        );
        if(this.transform){
            this.allowDomMove = false;
            var s = Wtf.getDom(this.transform);
            if(!this.hiddenName){
                this.hiddenName = s.name;
            }
            if(!this.store){
                this.mode = 'local';
                var d = [], opts = s.options;
                for(var i = 0, len = opts.length;i < len; i++){
                    var o = opts[i];
                    var value = (Wtf.isIE ? o.getAttributeNode('value').specified : o.hasAttribute('value')) ? o.value : o.text;
                    if(o.selected) {
                        this.value = value;
                    }
                    d.push([value, o.text]);
                }
                this.store = new Wtf.data.SimpleStore({
                    'id': 0,
                    fields: ['value', 'text'],
                    data : d
                });
                this.valueField = 'value';
                this.displayField = 'text';
            }
            s.name = Wtf.id();             if(!this.lazyRender){
                this.target = true;
                this.el = Wtf.DomHelper.insertBefore(s, this.autoCreate || this.defaultAutoCreate);
                Wtf.removeNode(s);                 this.render(this.el.parentNode);
            }else{
                Wtf.removeNode(s);             }

        }
        this.selectedIndex = -1;
        if(this.mode == 'local'){
            if(this.initialConfig.queryDelay === undefined){
                this.queryDelay = 10;
            }
            if(this.initialConfig.minChars === undefined){
                this.minChars = 0;
            }
        }
    },

        onRender : function(ct, position){
        Wtf.form.ComboBox.superclass.onRender.call(this, ct, position);
        if(this.hiddenName){
            this.hiddenField = this.el.insertSibling({tag:'input', type:'hidden', name: this.hiddenName, id: (this.hiddenId||this.hiddenName)},
                    'before', true);
            this.hiddenField.value =
                this.hiddenValue !== undefined ? this.hiddenValue :
                this.value !== undefined ? this.value : '';

                        this.el.dom.removeAttribute('name');
        }
        if(Wtf.isGecko){
            this.el.dom.setAttribute('autocomplete', 'off');
        }

        if(!this.lazyInit){
            this.initList();
        }else{
            this.on('focus', this.initList, this, {single: true});
        }

        if(!this.editable){
            this.editable = true;
            this.setEditable(false);
        }
    },

    initList : function(){
        if(!this.list){
            var cls = 'x-combo-list';

            this.list = new Wtf.Layer({
                shadow: this.shadow, cls: [cls, this.listClass].join(' '), constrain:false
            });

            var lw = this.listWidth || Math.max(this.wrap.getWidth(), this.minListWidth);
            this.list.setWidth(lw);
            this.list.swallowEvent('mousewheel');
            this.assetHeight = 0;

            if(this.title){
                this.header = this.list.createChild({cls:cls+'-hd', html: this.title});
                this.assetHeight += this.header.getHeight();
            }

            this.innerList = this.list.createChild({cls:cls+'-inner'});
            this.innerList.on('mouseover', this.onViewOver, this);
            this.innerList.on('mousemove', this.onViewMove, this);
            this.innerList.setWidth(lw - this.list.getFrameWidth('lr'));

            if(this.pageSize){
                this.footer = this.list.createChild({cls:cls+'-ft'});
                this.pageTb = new Wtf.PagingToolbar({
                    store:this.store,
                    pageSize: this.pageSize,
                    renderTo:this.footer
                });
                this.assetHeight += this.footer.getHeight();
            }

            if(!this.tpl){
			    
                this.tpl = '<tpl for="."><div class="'+cls+'-item">{' + this.displayField + '}</div></tpl>';
            }

		    
            this.view = new Wtf.DataView({
                applyTo: this.innerList,
                tpl: this.tpl,
                singleSelect: true,
                selectedClass: this.selectedClass,
                itemSelector: this.itemSelector || '.' + cls + '-item'
            });

            this.view.on('click', this.onViewClick, this);

            this.bindStore(this.store, true);

            if(this.resizable){
                this.resizer = new Wtf.Resizable(this.list,  {
                   pinned:true, handles:'se'
                });
                this.resizer.on('resize', function(r, w, h){
                    this.maxHeight = h-this.handleHeight-this.list.getFrameWidth('tb')-this.assetHeight;
                    this.listWidth = w;
                    this.innerList.setWidth(w - this.list.getFrameWidth('lr'));
                    this.restrictHeight();
                }, this);
                this[this.pageSize?'footer':'innerList'].setStyle('margin-bottom', this.handleHeight+'px');
            }
        }
    },


        bindStore : function(store, initial){
        if(this.store && !initial){
            this.store.un('beforeload', this.onBeforeLoad, this);
            this.store.un('load', this.onLoad, this);
            this.store.un('loadexception', this.collapse, this);
            if(!store){
                this.store = null;
                if(this.view){
                    this.view.setStore(null);
                }
            }
        }
        if(store){
            this.store = Wtf.StoreMgr.lookup(store);

            this.store.on('beforeload', this.onBeforeLoad, this);
            this.store.on('load', this.onLoad, this);
            this.store.on('loadexception', this.collapse, this);

            if(this.view){
                this.view.setStore(store);
            }
        }
    },

        initEvents : function(){
        Wtf.form.ComboBox.superclass.initEvents.call(this);

        this.keyNav = new Wtf.KeyNav(this.el, {
            "up" : function(e){
                this.inKeyMode = true;
                this.selectPrev();
            },

            "down" : function(e){
                if(!this.isExpanded()){
                    this.onTriggerClick();
                }else{
                    this.inKeyMode = true;
                    this.selectNext();
                }
            },

            "enter" : function(e){
                this.onViewClick();
                            },

            "esc" : function(e){
                this.collapse();
            },

            "tab" : function(e){
                this.onViewClick(false);
                return true;
            },

            scope : this,

            doRelay : function(foo, bar, hname){
                if(hname == 'down' || this.scope.isExpanded()){
                   return Wtf.KeyNav.prototype.doRelay.apply(this, arguments);
                }
                return true;
            },

            forceKeyDown : true
        });
        this.queryDelay = Math.max(this.queryDelay || 10,
                this.mode == 'local' ? 10 : 250);
        this.dqTask = new Wtf.util.DelayedTask(this.initQuery, this);
        if(this.typeAhead){
            this.taTask = new Wtf.util.DelayedTask(this.onTypeAhead, this);
        }
        if(this.editable !== false){
            this.el.on("keyup", this.onKeyUp, this);
        }
        if(this.forceSelection){
            this.on('blur', this.doForce, this);
        }
    },

    onDestroy : function(){
        if(this.view){
            this.view.el.removeAllListeners();
            this.view.el.remove();
            this.view.purgeListeners();
        }
        if(this.list){
            this.list.destroy();
        }
        this.bindStore(null);
        Wtf.form.ComboBox.superclass.onDestroy.call(this);
    },

        fireKey : function(e){
        if(e.isNavKeyPress() && !this.list.isVisible()){
            this.fireEvent("specialkey", this, e);
        }
    },

        onResize: function(w, h){
        Wtf.form.ComboBox.superclass.onResize.apply(this, arguments);
        if(this.list && this.listWidth === undefined){
            var lw = Math.max(w, this.minListWidth);
            this.list.setWidth(lw);
            this.innerList.setWidth(lw - this.list.getFrameWidth('lr'));
        }
    },

        onDisable: function(){
        Wtf.form.ComboBox.superclass.onDisable.apply(this, arguments);
        if(this.hiddenField){
            this.hiddenField.disabled = this.disabled;
        }
    },

    
    setEditable : function(value){
        if(value == this.editable){
            return;
        }
        this.editable = value;
        if(!value){
            this.el.dom.setAttribute('readOnly', true);
            this.el.on('mousedown', this.onTriggerClick,  this);
            this.el.addClass('x-combo-noedit');
        }else{
            this.el.dom.setAttribute('readOnly', false);
            this.el.un('mousedown', this.onTriggerClick,  this);
            this.el.removeClass('x-combo-noedit');
        }
    },

        onBeforeLoad : function(){
        if(!this.hasFocus){
            return;
        }
        this.innerList.update(this.loadingText ?
               '<div class="loading-indicator">'+this.loadingText+'</div>' : '');
        this.restrictHeight();
        this.selectedIndex = -1;
    },

        onLoad : function(){
        if(!this.hasFocus){
            return;
        }
        if(this.store.getCount() > 0){
            this.expand();
            this.restrictHeight();
            if(this.lastQuery == this.allQuery){
                if(this.editable){
                    this.el.dom.select();
                }
                if(!this.selectByValue(this.value, true)){
                    this.select(0, true);
                }
            }else{
                this.selectNext();
                if(this.typeAhead && this.lastKey != Wtf.EventObject.BACKSPACE && this.lastKey != Wtf.EventObject.DELETE){
                    this.taTask.delay(this.typeAheadDelay);
                }
            }
        }else{
            this.onEmptyResults();
        }
            },

        onTypeAhead : function(){
        if(this.store.getCount() > 0){
            var r = this.store.getAt(0);
            var newValue = r.data[this.displayField];
            var len = newValue.length;
            var selStart = this.getRawValue().length;
            if(selStart != len){
                this.setRawValue(newValue);
                this.selectText(selStart, newValue.length);
            }
        }
    },

        onSelect : function(record, index){
        if(this.fireEvent('beforeselect', this, record, index) !== false){
            this.setValue(record.data[this.valueField || this.displayField]);
            this.collapse();
            this.fireEvent('select', this, record, index);
        }
    },

    
    getValue : function(){
        if(this.valueField){
            return typeof this.value != 'undefined' ? this.value : '';
        }else{
            return Wtf.form.ComboBox.superclass.getValue.call(this);
        }
    },

    
    clearValue : function(){
        if(this.hiddenField){
            this.hiddenField.value = '';
        }
        this.setRawValue('');
        this.lastSelectionText = '';
        this.applyEmptyText();
    },

    
    setValue : function(v){
        var text = v;
        if(this.valueField){
            var r = this.findRecord(this.valueField, v);
            if(r){
                text = r.data[this.displayField];
            }else if(this.valueNotFoundText !== undefined){
                text = this.valueNotFoundText;
            }
        }
        this.lastSelectionText = text;
        if(this.hiddenField){
            this.hiddenField.value = v;
        }
        Wtf.form.ComboBox.superclass.setValue.call(this, text);
        this.value = v;
    },

        findRecord : function(prop, value){
        var record;
        if(this.store.getCount() > 0){
            this.store.each(function(r){
                if(r.data[prop] == value){
                    record = r;
                    return false;
                }
            });
        }
        return record;
    },

        onViewMove : function(e, t){
        this.inKeyMode = false;
    },

        onViewOver : function(e, t){
        if(this.inKeyMode){             return;
        }
        var item = this.view.findItemFromChild(t);
        if(item){
            var index = this.view.indexOf(item);
            this.select(index, false);
        }
    },

        onViewClick : function(doFocus){
        var index = this.view.getSelectedIndexes()[0];
        var r = this.store.getAt(index);
        if(r){
            this.onSelect(r, index);
        }
        if(doFocus !== false){
            this.el.focus();
        }
    },

        restrictHeight : function(){
        this.innerList.dom.style.height = '';
        var inner = this.innerList.dom;
        var fw = this.list.getFrameWidth('tb');
        var h = Math.max(inner.clientHeight, inner.offsetHeight, inner.scrollHeight);
        this.innerList.setHeight(h < this.maxHeight ? 'auto' : this.maxHeight);
        this.list.beginUpdate();
        this.list.setHeight(this.innerList.getHeight()+fw+(this.resizable?this.handleHeight:0)+this.assetHeight);
        this.list.alignTo(this.el, this.listAlign);
        this.list.endUpdate();
    },

        onEmptyResults : function(){
        this.collapse();
    },

    
    isExpanded : function(){
        return this.list && this.list.isVisible();
    },

    
    selectByValue : function(v, scrollIntoView){
        if(v !== undefined && v !== null){
            var r = this.findRecord(this.valueField || this.displayField, v);
            if(r){
                this.select(this.store.indexOf(r), scrollIntoView);
                return true;
            }
        }
        return false;
    },

    
    select : function(index, scrollIntoView){
        this.selectedIndex = index;
        this.view.select(index);
        if(scrollIntoView !== false){
            var el = this.view.getNode(index);
            if(el){
                this.innerList.scrollChildIntoView(el, false);
            }
        }
    },

        selectNext : function(){
        var ct = this.store.getCount();
        if(ct > 0){
            if(this.selectedIndex == -1){
                this.select(0);
            }else if(this.selectedIndex < ct-1){
                this.select(this.selectedIndex+1);
            }
        }
    },

        selectPrev : function(){
        var ct = this.store.getCount();
        if(ct > 0){
            if(this.selectedIndex == -1){
                this.select(0);
            }else if(this.selectedIndex != 0){
                this.select(this.selectedIndex-1);
            }
        }
    },

        onKeyUp : function(e){
        if(this.editable !== false && !e.isSpecialKey()){
            this.lastKey = e.getKey();
            this.dqTask.delay(this.queryDelay);
        }
    },

        validateBlur : function(){
        return !this.list || !this.list.isVisible();   
    },

        initQuery : function(){
        this.doQuery(this.getRawValue());
    },

        doForce : function(){
        if(this.el.dom.value.length > 0){
            this.el.dom.value =
                this.lastSelectionText === undefined ? '' : this.lastSelectionText;
            this.applyEmptyText();
        }
    },

    
    doQuery : function(q, forceAll){
        if(q === undefined || q === null){
            q = '';
        }
        var qe = {
            query: q,
            forceAll: forceAll,
            combo: this,
            cancel:false
        };
        if(this.fireEvent('beforequery', qe)===false || qe.cancel){
            return false;
        }
        q = qe.query;
        forceAll = qe.forceAll;
        if(forceAll === true || (q.length >= this.minChars)){
            if(this.lastQuery !== q){
                this.lastQuery = q;
                if(this.mode == 'local'){
                    this.selectedIndex = -1;
                    if(forceAll){
                        this.store.clearFilter();
                    }else{
                        this.store.filter(this.displayField, q);
                    }
                    this.onLoad();
                }else{
                    this.store.baseParams[this.queryParam] = q;
                    this.store.load({
                        params: this.getParams(q)
                    });
                    this.expand();
                }
            }else{
                this.selectedIndex = -1;
                this.onLoad();   
            }
        }
    },

        getParams : function(q){
        var p = {};
                if(this.pageSize){
            p.start = 0;
            p.limit = this.pageSize;
        }
        return p;
    },

    
    collapse : function(){
        if(!this.isExpanded()){
            return;
        }
        this.list.hide();
        Wtf.getDoc().un('mousewheel', this.collapseIf, this);
        Wtf.getDoc().un('mousedown', this.collapseIf, this);
        this.fireEvent('collapse', this);
    },

        collapseIf : function(e){
        if(!e.within(this.wrap) && !e.within(this.list)){
            this.collapse();
        }
    },

    
    expand : function(){
        if(this.isExpanded() || !this.hasFocus){
            return;
        }
        this.list.alignTo(this.wrap, this.listAlign);
        this.list.show();
        Wtf.getDoc().on('mousewheel', this.collapseIf, this);
        Wtf.getDoc().on('mousedown', this.collapseIf, this);
        this.fireEvent('expand', this);
    },

            onTriggerClick : function(){
        if(this.disabled){
            return;
        }
        if(this.isExpanded()){
            this.collapse();
            this.el.focus();
        }else {
            this.onFocus({});
            if(this.triggerAction == 'all') {
                this.doQuery(this.allQuery, true);
            } else {
                this.doQuery(this.getRawValue());
            }
            this.el.focus();
        }
    }

    
    
    
    

});
Wtf.reg('combo', Wtf.form.ComboBox);

Wtf.form.Checkbox = Wtf.extend(Wtf.form.Field,  {
    
    focusClass : undefined,
    
    fieldClass: "x-form-field",
    
    checked: false,
    
    defaultAutoCreate : { tag: "input", type: 'checkbox', autocomplete: "off"},
    
    

	    initComponent : function(){
        Wtf.form.Checkbox.superclass.initComponent.call(this);
        this.addEvents(
            
            'check'
        );
    },

        onResize : function(){
        Wtf.form.Checkbox.superclass.onResize.apply(this, arguments);
        if(!this.boxLabel){
            this.el.alignTo(this.wrap, 'c-c');
        }
    },
    
        initEvents : function(){
        Wtf.form.Checkbox.superclass.initEvents.call(this);
        this.el.on("click", this.onClick,  this);
        this.el.on("change", this.onClick,  this);
    },

	    getResizeEl : function(){
        return this.wrap;
    },

        getPositionEl : function(){
        return this.wrap;
    },

    
    markInvalid : Wtf.emptyFn,
    
    clearInvalid : Wtf.emptyFn,

        onRender : function(ct, position){
        Wtf.form.Checkbox.superclass.onRender.call(this, ct, position);
        if(this.inputValue !== undefined){
            this.el.dom.value = this.inputValue;
        }
        this.wrap = this.el.wrap({cls: "x-form-check-wrap"});
        if(this.boxLabel){
            this.wrap.createChild({tag: 'label', htmlFor: this.el.id, cls: 'x-form-cb-label', html: this.boxLabel});
        }
        if(this.checked){
            this.setValue(true);
        }else{
            this.checked = this.el.dom.checked;
        }
    },
    
        onDestroy : function(){
        if(this.wrap){
            this.wrap.remove();
        }
        Wtf.form.Checkbox.superclass.onDestroy.call(this);
    },

        initValue : Wtf.emptyFn,

    
    getValue : function(){
        if(this.rendered){
            return this.el.dom.checked;
        }
        return false;
    },

	    onClick : function(){
        if(this.el.dom.checked != this.checked){
            this.setValue(this.el.dom.checked);
        }
    },

    
    setValue : function(v){
        this.checked = (v === true || v === 'true' || v == '1' || String(v).toLowerCase() == 'on');
        if(this.el && this.el.dom){
            this.el.dom.checked = this.checked;
            this.el.dom.defaultChecked = this.checked;
        }
        this.fireEvent("check", this, this.checked);
    }
});
Wtf.reg('checkbox', Wtf.form.Checkbox);

Wtf.form.Radio = Wtf.extend(Wtf.form.Checkbox, {
    inputType: 'radio',

    
    markInvalid : Wtf.emptyFn,
    
    clearInvalid : Wtf.emptyFn,

    
    getGroupValue : function(){
        return this.el.up('form').child('input[name='+this.el.dom.name+']:checked', true).value;
    }
});
Wtf.reg('radio', Wtf.form.Radio);

Wtf.form.Hidden = Wtf.extend(Wtf.form.Field, {
    
    inputType : 'hidden',

    
    onRender : function(){
        Wtf.form.Hidden.superclass.onRender.apply(this, arguments);
    },

    
    initEvents : function(){
        this.originalValue = this.getValue();
    },

    
    setSize : Wtf.emptyFn,
    setWidth : Wtf.emptyFn,
    setHeight : Wtf.emptyFn,
    setPosition : Wtf.emptyFn,
    setPagePosition : Wtf.emptyFn,
    markInvalid : Wtf.emptyFn,
    clearInvalid : Wtf.emptyFn
});
Wtf.reg('hidden', Wtf.form.Hidden);

Wtf.form.BasicForm = function(el, config){
    Wtf.apply(this, config);
    
    this.items = new Wtf.util.MixedCollection(false, function(o){
        return o.id || (o.id = Wtf.id());
    });
    this.addEvents(
        
        'beforeaction',
        
        'actionfailed',
        
        'actioncomplete'
    );
    
    if(el){
        this.initEl(el);
    }
    Wtf.form.BasicForm.superclass.constructor.call(this);
};

Wtf.extend(Wtf.form.BasicForm, Wtf.util.Observable, {
    
    
    
    
    
    
    
    timeout: 30,

        activeAction : null,

    
    trackResetOnLoad : false,

    
    
        initEl : function(el){
        this.el = Wtf.get(el);
        this.id = this.el.id || Wtf.id();
        this.el.on('submit', this.onSubmit, this);
        this.el.addClass('x-form');
    },

    
    getEl: function(){
        return this.el;
    },

        onSubmit : function(e){
        e.stopEvent();
    },
    
    	destroy: function() {
        this.items.each(function(f){
            Wtf.destroy(f);
        });
		this.el.removeAllListeners();
		this.el.remove();
		this.purgeListeners();
	},

    
    isValid : function(){
        var valid = true;
        this.items.each(function(f){
           if(!f.validate()){
               valid = false;
           }
        });
        return valid;
    },

    
    isDirty : function(){
        var dirty = false;
        this.items.each(function(f){
           if(f.isDirty()){
               dirty = true;
               return false;
           }
        });
        return dirty;
    },

    
    doAction : function(action, options){
        if(typeof action == 'string'){
            action = new Wtf.form.Action.ACTION_TYPES[action](this, options);
        }
        if(this.fireEvent('beforeaction', this, action) !== false){
            this.beforeAction(action);
            action.run.defer(100, action);
        }
        return this;
    },

    
    submit : function(options){
        this.doAction('submit', options);
        return this;
    },

    
    load : function(options){
        this.doAction('load', options);
        return this;
    },

    
    updateRecord : function(record){
        record.beginEdit();
        var fs = record.fields;
        fs.each(function(f){
            var field = this.findField(f.name);
            if(field){
                record.set(f.name, field.getValue());
            }
        }, this);
        record.endEdit();
        return this;
    },

    
    loadRecord : function(record){
        this.setValues(record.data);
        return this;
    },

        beforeAction : function(action){
        var o = action.options;
        if(o.waitMsg){
            if(this.waitMsgTarget === true){
                this.el.mask(o.waitMsg, 'x-mask-loading');
            }else if(this.waitMsgTarget){
                this.waitMsgTarget = Wtf.get(this.waitMsgTarget);
                this.waitMsgTarget.mask(o.waitMsg, 'x-mask-loading');
            }else{
                Wtf.MessageBox.wait(o.waitMsg, o.waitTitle || this.waitTitle || 'Please Wait...');
            }
        }
    },

        afterAction : function(action, success){
        this.activeAction = null;
        var o = action.options;
        if(o.waitMsg){
            if(this.waitMsgTarget === true){
                this.el.unmask();
            }else if(this.waitMsgTarget){
                this.waitMsgTarget.unmask();
            }else{
                Wtf.MessageBox.updateProgress(1);
                Wtf.MessageBox.hide();
            }
        }
        if(success){
            if(o.reset){
                this.reset();
            }
            Wtf.callback(o.success, o.scope, [this, action]);
            this.fireEvent('actioncomplete', this, action);
        }else{
            Wtf.callback(o.failure, o.scope, [this, action]);
            this.fireEvent('actionfailed', this, action);
        }
    },

    
    findField : function(id){
        var field = this.items.get(id);
        if(!field){
            this.items.each(function(f){
                if(f.isFormField && (f.dataIndex == id || f.id == id || f.getName() == id)){
                    field = f;
                    return false;
                }
            });
        }
        return field || null;
    },


    
    markInvalid : function(errors){
        if(errors instanceof Array){
            for(var i = 0, len = errors.length; i < len; i++){
                var fieldError = errors[i];
                var f = this.findField(fieldError.id);
                if(f){
                    f.markInvalid(fieldError.msg);
                }
            }
        }else{
            var field, id;
            for(id in errors){
                if(typeof errors[id] != 'function' && (field = this.findField(id))){
                    field.markInvalid(errors[id]);
                }
            }
        }
        return this;
    },

    
    setValues : function(values){
        if(values instanceof Array){             for(var i = 0, len = values.length; i < len; i++){
                var v = values[i];
                var f = this.findField(v.id);
                if(f){
                    f.setValue(v.value);
                    if(this.trackResetOnLoad){
                        f.originalValue = f.getValue();
                    }
                }
            }
        }else{             var field, id;
            for(id in values){
                if(typeof values[id] != 'function' && (field = this.findField(id))){
                    field.setValue(values[id]);
                    if(this.trackResetOnLoad){
                        field.originalValue = field.getValue();
                    }
                }
            }
        }
        return this;
    },

    
    getValues : function(asString){
        var fs = Wtf.lib.Ajax.serializeForm(this.el.dom);
        if(asString === true){
            return fs;
        }
        return Wtf.urlDecode(fs);
    },

    
    clearInvalid : function(){
        this.items.each(function(f){
           f.clearInvalid();
        });
        return this;
    },

    
    reset : function(){
        this.items.each(function(f){
            f.reset();
        });
        return this;
    },

    
    add : function(){
        this.items.addAll(Array.prototype.slice.call(arguments, 0));
        return this;
    },


    
    remove : function(field){
        this.items.remove(field);
        return this;
    },

    
    render : function(){
        this.items.each(function(f){
            if(f.isFormField && !f.rendered && document.getElementById(f.id)){                 f.applyToMarkup(f.id);
            }
        });
        return this;
    },

    
    applyToFields : function(o){
        this.items.each(function(f){
           Wtf.apply(f, o);
        });
        return this;
    },

    
    applyIfToFields : function(o){
        this.items.each(function(f){
           Wtf.applyIf(f, o);
        });
        return this;
    }
});

Wtf.BasicForm = Wtf.form.BasicForm;

Wtf.FormPanel = Wtf.extend(Wtf.Panel, {
    
    
    
    buttonAlign:'center',

    
    minButtonWidth:75,

    
    labelAlign:'left',

    
    monitorValid : false,

    
    monitorPoll : 200,

    
    layout: 'form',

        initComponent :function(){
        this.form = this.createForm();
        
        Wtf.FormPanel.superclass.initComponent.call(this);

        this.addEvents(
            
            'clientvalidation'
        );

        this.relayEvents(this.form, ['beforeaction', 'actionfailed', 'actioncomplete']);
    },

        createForm: function(){
        delete this.initialConfig.listeners;
        return new Wtf.form.BasicForm(null, this.initialConfig);
    },

        initFields : function(){
        var f = this.form;
        var formPanel = this;
        var fn = function(c){
            if(c.doLayout && c != formPanel){
                Wtf.applyIf(c, {
                    labelAlign: c.ownerCt.labelAlign,
                    labelWidth: c.ownerCt.labelWidth,
                    itemCls: c.ownerCt.itemCls
                });
                if(c.items){
                    c.items.each(fn);
                }
            }else if(c.isFormField){
                f.add(c);
            }
        }
        this.items.each(fn);
    },

        getLayoutTarget : function(){
        return this.form.el;
    },

    
    getForm : function(){
        return this.form;
    },

        onRender : function(ct, position){
        this.initFields();

        Wtf.FormPanel.superclass.onRender.call(this, ct, position);
        var o = {
            tag: 'form',
            method : this.method || 'POST',
            id : this.formId || Wtf.id()
        };
        if(this.fileUpload) {
            o.enctype = 'multipart/form-data';
        }
        this.form.initEl(this.body.createChild(o));
    },
    
        beforeDestroy: function(){
        Wtf.FormPanel.superclass.beforeDestroy.call(this);
        Wtf.destroy(this.form);
    },

        initEvents : function(){
        Wtf.FormPanel.superclass.initEvents.call(this);

        if(this.monitorValid){             this.startMonitoring();
        }
    },

    
    startMonitoring : function(){
        if(!this.bound){
            this.bound = true;
            Wtf.TaskMgr.start({
                run : this.bindHandler,
                interval : this.monitorPoll || 200,
                scope: this
            });
        }
    },

    
    stopMonitoring : function(){
        this.bound = false;
    },

    
    load : function(){
        this.form.load.apply(this.form, arguments);  
    },

        onDisable : function(){
        Wtf.FormPanel.superclass.onDisable.call(this);
        if(this.form){
            this.form.items.each(function(){
                 this.disable();
            });
        }
    },

        onEnable : function(){
        Wtf.FormPanel.superclass.onEnable.call(this);
        if(this.form){
            this.form.items.each(function(){
                 this.enable();
            });
        }
    },

        bindHandler : function(){
        if(!this.bound){
            return false;         }
        var valid = true;
        this.form.items.each(function(f){
            if(!f.isValid(true)){
                valid = false;
                return false;
            }
        });
        if(this.buttons){
            for(var i = 0, len = this.buttons.length; i < len; i++){
                var btn = this.buttons[i];
                if(btn.formBind === true && btn.disabled === valid){
                    btn.setDisabled(!valid);
                }
            }
        }
        this.fireEvent('clientvalidation', this, valid);
    }
});
Wtf.reg('form', Wtf.FormPanel);

Wtf.form.FormPanel = Wtf.FormPanel;



Wtf.form.FieldSet = Wtf.extend(Wtf.Panel, {
    
    
    
    
    
    baseCls:'x-fieldset',
    
    layout: 'form',
    
    
    onRender : function(ct, position){
        if(!this.el){
            this.el = document.createElement('fieldset');
            this.el.id = this.id;
            this.el.appendChild(document.createElement('legend')).className = 'x-fieldset-header';
        }

        Wtf.form.FieldSet.superclass.onRender.call(this, ct, position);

        if(this.checkboxToggle){
            var o = typeof this.checkboxToggle == 'object' ?
                    this.checkboxToggle :
                    {tag: 'input', type: 'checkbox', name: this.checkboxName || this.id+'-checkbox'};
            this.checkbox = this.header.insertFirst(o);
            this.checkbox.dom.checked = !this.collapsed;
            this.checkbox.on('click', this.onCheckClick, this);
        }
    },

    
    onCollapse : function(doAnim, animArg){
        if(this.checkbox){
            this.checkbox.dom.checked = false;
        }
        this.afterCollapse();

    },

    
    onExpand : function(doAnim, animArg){
        if(this.checkbox){
            this.checkbox.dom.checked = true;
        }
        this.afterExpand();
    },

    
    onCheckClick : function(){
        this[this.checkbox.dom.checked ? 'expand' : 'collapse']();
    }

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
});
Wtf.reg('fieldset', Wtf.form.FieldSet);




Wtf.form.HtmlEditor = Wtf.extend(Wtf.form.Field, {
    
    enableFormat : true,
    
    enableFontSize : true,
    
    enableColors : true,
    
    enableAlignments : true,
    
    enableLists : true,
    
    enableSourceEdit : true,
    
    enableLinks : true,
    
    enableFont : true,
    
    createLinkText : 'Please enter the URL for the link:',
    
    defaultLinkValue : 'http:/'+'/',
    
    fontFamilies : [
        'Arial',
        'Courier New',
        'Tahoma',
        'Times New Roman',
        'Verdana'
    ],
    defaultFont: 'tahoma',

    
    validationEvent : false,
    deferHeight: true,
    initialized : false,
    activated : false,
    sourceEditMode : false,
    onFocus : Wtf.emptyFn,
    iframePad:3,
    hideMode:'offsets',
    defaultAutoCreate : {
        tag: "textarea",
        style:"width:500px;height:300px;",
        autocomplete: "off"
    },

    
    initComponent : function(){
        this.addEvents(
            
            'initialize',
            
            'activate',
             
            'beforesync',
             
            'beforepush',
             
            'sync',
             
            'push',
             
            'editmodechange'
        )
    },

    createFontOptions : function(){
        var buf = [], fs = this.fontFamilies, ff, lc;
        for(var i = 0, len = fs.length; i< len; i++){
            ff = fs[i];
            lc = ff.toLowerCase();
            buf.push(
                '<option value="',lc,'" style="font-family:',ff,';"',
                    (this.defaultFont == lc ? ' selected="true">' : '>'),
                    ff,
                '</option>'
            );
        }
        return buf.join('');
    },
    
    createToolbar : function(editor){

        function btn(id, toggle, handler){
            return {
                itemId : id,
                cls : 'x-btn-icon x-edit-'+id,
                enableToggle:toggle !== false,
                scope: editor,
                handler:handler||editor.relayBtnCmd,
                clickEvent:'mousedown',
                tooltip: editor.buttonTips[id] || undefined,
                tabIndex:-1
            };
        }

        
        var tb = new Wtf.Toolbar({
            renderTo:this.wrap.dom.firstChild
        });

        
        tb.el.on('click', function(e){
            e.preventDefault();
        });

        if(this.enableFont && !Wtf.isSafari){
            this.fontSelect = tb.el.createChild({
                tag:'select',
                cls:'x-font-select',
                html: this.createFontOptions()
            });
            this.fontSelect.on('change', function(){
                var font = this.fontSelect.dom.value;
                this.relayCmd('fontname', font);
                this.deferFocus();
            }, this);
            tb.add(
                this.fontSelect.dom,
                '-'
            );
        };

        if(this.enableFormat){
            tb.add(
                btn('bold'),
                btn('italic'),
                btn('underline')
            );
        };

        if(this.enableFontSize){
            tb.add(
                '-',
                btn('increasefontsize', false, this.adjustFont),
                btn('decreasefontsize', false, this.adjustFont)
            );
        };

        if(this.enableColors){
            tb.add(
                '-', {
                    itemId:'forecolor',
                    cls:'x-btn-icon x-edit-forecolor',
                    clickEvent:'mousedown',
                    tooltip: editor.buttonTips['forecolor'] || undefined,
                    tabIndex:-1,
                    menu : new Wtf.menu.ColorMenu({
                        allowReselect: true,
                        focus: Wtf.emptyFn,
                        value:'000000',
                        plain:true,
                        selectHandler: function(cp, color){
                            this.execCmd('forecolor', Wtf.isSafari || Wtf.isIE ? '#'+color : color);
                            this.deferFocus();
                        },
                        scope: this,
                        clickEvent:'mousedown'
                    })
                }, {
                    itemId:'backcolor',
                    cls:'x-btn-icon x-edit-backcolor',
                    clickEvent:'mousedown',
                    tooltip: editor.buttonTips['backcolor'] || undefined,
                    tabIndex:-1,
                    menu : new Wtf.menu.ColorMenu({
                        focus: Wtf.emptyFn,
                        value:'FFFFFF',
                        plain:true,
                        allowReselect: true,
                        selectHandler: function(cp, color){
                            if(Wtf.isGecko){
                                this.execCmd('useCSS', false);
                                this.execCmd('hilitecolor', color);
                                this.execCmd('useCSS', true);
                                this.deferFocus();
                            }else{
                                this.execCmd(Wtf.isOpera ? 'hilitecolor' : 'backcolor', Wtf.isSafari || Wtf.isIE ? '#'+color : color);
                                this.deferFocus();
                            }
                        },
                        scope:this,
                        clickEvent:'mousedown'
                    })
                }
            );
        };

        if(this.enableAlignments){
            tb.add(
                '-',
                btn('justifyleft'),
                btn('justifycenter'),
                btn('justifyright')
            );
        };

        if(!Wtf.isSafari){
            if(this.enableLinks){
                tb.add(
                    '-',
                    btn('createlink', false, this.createLink)
                );
            };

            if(this.enableLists){
                tb.add(
                    '-',
                    btn('insertorderedlist'),
                    btn('insertunorderedlist')
                );
            }
            if(this.enableSourceEdit){
                tb.add(
                    '-',
                    btn('sourceedit', true, function(btn){
                        this.toggleSourceEdit(btn.pressed);
                    })
                );
            }
        }

        this.tb = tb;
    },

    
    getDocMarkup : function(){
        return '<html><head><style type="text/css">body{border:0;margin:0;padding:3px;height:98%;cursor:text;}</style></head><body></body></html>';
    },

    getEditorBody : function(){
        return this.doc.body || this.doc.documentElement;
    },

    
    onRender : function(ct, position){
        Wtf.form.HtmlEditor.superclass.onRender.call(this, ct, position);
        this.el.dom.style.border = '0 none';
        this.el.dom.setAttribute('tabIndex', -1);
        this.el.addClass('x-hidden');
        if(Wtf.isIE){ 
            this.el.applyStyles('margin-top:-1px;margin-bottom:-1px;')
        }
        this.wrap = this.el.wrap({
            cls:'x-html-editor-wrap', cn:{cls:'x-html-editor-tb'}
        });

        this.createToolbar(this);

        this.tb.items.each(function(item){
           if(item.itemId != 'sourceedit'){
                item.disable();
            }
        });

        var iframe = document.createElement('iframe');
        iframe.name = Wtf.id();
        iframe.frameBorder = 'no';

        iframe.src=(Wtf.SSL_SECURE_URL || "javascript:false");

        this.wrap.dom.appendChild(iframe);

        this.iframe = iframe;

        if(Wtf.isIE){
            iframe.contentWindow.document.designMode = 'on';
            this.doc = iframe.contentWindow.document;
            this.win = iframe.contentWindow;
        } else {
            this.doc = (iframe.contentDocument || window.frames[iframe.name].document);
            this.win = window.frames[iframe.name];
            this.doc.designMode = 'on';
        }
        this.doc.open();
        this.doc.write(this.getDocMarkup())
        this.doc.close();

        var task = { 
            run : function(){
                if(this.doc.body || this.doc.readyState == 'complete'){
                    Wtf.TaskMgr.stop(task);
                    this.doc.designMode="on";
                    this.initEditor.defer(10, this);
                }
            },
            interval : 10,
            duration:10000,
            scope: this
        };
        Wtf.TaskMgr.start(task);

        if(!this.width){
            this.setSize(this.el.getSize());
        }
    },

    
    onResize : function(w, h){
        Wtf.form.HtmlEditor.superclass.onResize.apply(this, arguments);
        if(this.el && this.iframe){
            if(typeof w == 'number'){
                var aw = w - this.wrap.getFrameWidth('lr');
                this.el.setWidth(this.adjustWidth('textarea', aw));
                this.iframe.style.width = aw + 'px';
            }
            if(typeof h == 'number'){
                var ah = h - this.wrap.getFrameWidth('tb') - this.tb.el.getHeight();
                this.el.setHeight(this.adjustWidth('textarea', ah));
                this.iframe.style.height = ah + 'px';
                if(this.doc){
                    this.getEditorBody().style.height = (ah - (this.iframePad*2)) + 'px';
                }
            }
        }
    },

    
    toggleSourceEdit : function(sourceEditMode){
        if(sourceEditMode === undefined){
            sourceEditMode = !this.sourceEditMode;
        }
        this.sourceEditMode = sourceEditMode === true;
        var btn = this.tb.items.get('sourceedit');
        if(btn.pressed !== this.sourceEditMode){
            btn.toggle(this.sourceEditMode);
            return;
        }
        if(this.sourceEditMode){
            this.tb.items.each(function(item){
                if(item.itemId != 'sourceedit'){
                    item.disable();
                }
            });
            this.syncValue();
            this.iframe.className = 'x-hidden';
            this.el.removeClass('x-hidden');
            this.el.dom.removeAttribute('tabIndex');
            this.el.focus();
        }else{
            if(this.initialized){
                this.tb.items.each(function(item){
                    item.enable();
                });
            }
            this.pushValue();
            this.iframe.className = '';
            this.el.addClass('x-hidden');
            this.el.dom.setAttribute('tabIndex', -1);
            this.deferFocus();
        }
        var lastSize = this.lastSize;
        if(lastSize){
            delete this.lastSize;
            this.setSize(lastSize);
        }
        this.fireEvent('editmodechange', this, this.sourceEditMode);
    },

    
    createLink : function(){
        var url = prompt(this.createLinkText, this.defaultLinkValue);
        if(url && url != 'http:/'+'/'){
            this.relayCmd('createlink', url);
        }
    },

    
    adjustSize : Wtf.BoxComponent.prototype.adjustSize,

    
    getResizeEl : function(){
        return this.wrap;
    },

    
    getPositionEl : function(){
        return this.wrap;
    },

    
    initEvents : function(){
        this.originalValue = this.getValue();
    },

    
    markInvalid : Wtf.emptyFn,
    
    clearInvalid : Wtf.emptyFn,

    setValue : function(v){
        Wtf.form.HtmlEditor.superclass.setValue.call(this, v);
        this.pushValue();
    },

    
    cleanHtml : function(html){
        html = String(html);
        if(html.length > 5){
            if(Wtf.isSafari){ 
                html = html.replace(/\sclass="(?:Apple-style-span|khtml-block-placeholder)"/gi, '');
            }
        }
        if(html == '&nbsp;'){
            html = '';
        }
        return html;
    },

    
    syncValue : function(){
        if(this.initialized){
            var bd = this.getEditorBody();
            var html = bd.innerHTML;
            if(Wtf.isSafari){
                var bs = bd.getAttribute('style'); 
                var m = bs.match(/text-align:(.*?);/i);
                if(m && m[1]){
                    html = '<div style="'+m[0]+'">' + html + '</div>';
                }
            }
            html = this.cleanHtml(html);
            if(this.fireEvent('beforesync', this, html) !== false){
                this.el.dom.value = html;
                this.fireEvent('sync', this, html);
            }
        }
    },

    
    pushValue : function(){
        if(this.initialized){
            var v = this.el.dom.value;
            if(!this.activated && v.length < 1){
                v = '&nbsp;';
            }
            if(this.fireEvent('beforepush', this, v) !== false){
                this.getEditorBody().innerHTML = v;
                this.fireEvent('push', this, v);
            }
        }
    },

    
    deferFocus : function(){
        this.focus.defer(10, this);
    },

    
    focus : function(){
        if(this.win && !this.sourceEditMode){
            this.win.focus();
        }else{
            this.el.focus();
        }
    },

    
    initEditor : function(){
        var dbody = this.getEditorBody();
        var ss = this.el.getStyles('font-size', 'font-family', 'background-image', 'background-repeat');
        ss['background-attachment'] = 'fixed'; 
        dbody.bgProperties = 'fixed'; 
        Wtf.DomHelper.applyStyles(dbody, ss);
        Wtf.EventManager.on(this.doc, {
            'mousedown': this.onEditorEvent,
            'dblclick': this.onEditorEvent,
            'click': this.onEditorEvent,
            'keyup': this.onEditorEvent,
            buffer:100,
            scope: this
        });
        if(Wtf.isGecko){
            Wtf.EventManager.on(this.doc, 'keypress', this.applyCommand, this);
        }
        if(Wtf.isIE || Wtf.isSafari || Wtf.isOpera){
            Wtf.EventManager.on(this.doc, 'keydown', this.fixKeys, this);
        }
        this.initialized = true;

        this.fireEvent('initialize', this);
        this.pushValue();
    },

    
    onDestroy : function(){
        if(this.rendered){
            this.tb.items.each(function(item){
                if(item.menu){
                    item.menu.removeAll();
                    if(item.menu.el){
                        item.menu.el.destroy();
                    }
                }
                item.destroy();
            });
            this.wrap.dom.innerHTML = '';
            this.wrap.remove();
        }
    },

    
    onFirstFocus : function(){
        this.activated = true;
        this.tb.items.each(function(item){
           item.enable();
        });
        if(Wtf.isGecko){ 
            this.win.focus();
            var s = this.win.getSelection();
            if(!s.focusNode || s.focusNode.nodeType != 3){
                var r = s.getRangeAt(0);
                r.selectNodeContents(this.getEditorBody());
                r.collapse(true);
                this.deferFocus();
            }
            try{
                this.execCmd('useCSS', true);
                this.execCmd('styleWithCSS', false);
            }catch(e){}
        }
        this.fireEvent('activate', this);
    },

    
    adjustFont: function(btn){
        var adjust = btn.itemId == 'increasefontsize' ? 1 : -1;
        if(Wtf.isSafari){ 
            adjust *= 2;
        }
        var v = parseInt(this.doc.queryCommandValue('FontSize')|| 3, 10);
        v = Math.max(1, v+adjust);
        this.execCmd('FontSize', v + (Wtf.isSafari ? 'px' : 0));
    },

    onEditorEvent : function(e){
        this.updateToolbar();
    },


    
    updateToolbar: function(){

        if(!this.activated){
            this.onFirstFocus();
            return;
        }

        var btns = this.tb.items.map, doc = this.doc;

        if(this.enableFont && !Wtf.isSafari){
            var name = (this.doc.queryCommandValue('FontName')||this.defaultFont).toLowerCase();
            if(name != this.fontSelect.dom.value){
                this.fontSelect.dom.value = name;
            }
        }
        if(this.enableFormat){
            btns.bold.toggle(doc.queryCommandState('bold'));
            btns.italic.toggle(doc.queryCommandState('italic'));
            btns.underline.toggle(doc.queryCommandState('underline'));
        }
        if(this.enableAlignments){
            btns.justifyleft.toggle(doc.queryCommandState('justifyleft'));
            btns.justifycenter.toggle(doc.queryCommandState('justifycenter'));
            btns.justifyright.toggle(doc.queryCommandState('justifyright'));
        }
        if(!Wtf.isSafari && this.enableLists){
            btns.insertorderedlist.toggle(doc.queryCommandState('insertorderedlist'));
            btns.insertunorderedlist.toggle(doc.queryCommandState('insertunorderedlist'));
        }
        
        Wtf.menu.MenuMgr.hideAll();

        this.syncValue();
    },

    
    relayBtnCmd : function(btn){
        this.relayCmd(btn.itemId);
    },

    
    relayCmd : function(cmd, value){
        this.win.focus();
        this.execCmd(cmd, value);
        this.updateToolbar();
        this.deferFocus();
    },

    
    execCmd : function(cmd, value){
        this.doc.execCommand(cmd, false, value === undefined ? null : value);
        this.syncValue();
    },

    
    applyCommand : function(e){
        if(e.ctrlKey){
            var c = e.getCharCode(), cmd;
            if(c > 0){
                c = String.fromCharCode(c);
                switch(c){
                    case 'b':
                        cmd = 'bold';
                    break;
                    case 'i':
                        cmd = 'italic';
                    break;
                    case 'u':
                        cmd = 'underline';
                    break;
                }
                if(cmd){
                    this.win.focus();
                    this.execCmd(cmd);
                    this.deferFocus();
                    e.preventDefault();
                }
            }
        }
    },

    
    insertAtCursor : function(text){
        if(!this.activated){
            return;
        }
        if(Wtf.isIE){
            this.win.focus();
            var r = this.doc.selection.createRange();
            if(r){
                r.collapse(true);
                r.pasteHTML(text);
                this.syncValue();
                this.deferFocus();
            }
        }else if(Wtf.isGecko || Wtf.isOpera){
            this.win.focus();
            this.execCmd('InsertHTML', text);
            this.deferFocus();
        }else if(Wtf.isSafari){
            this.execCmd('InsertText', text);
            this.deferFocus();
        }
    },

    
    fixKeys : function(){ 
        if(Wtf.isIE){
            return function(e){
                var k = e.getKey(), r;
                if(k == e.TAB){
                    e.stopEvent();
                    r = this.doc.selection.createRange();
                    if(r){
                        r.collapse(true);
                        r.pasteHTML('&nbsp;&nbsp;&nbsp;&nbsp;');
                        this.deferFocus();
                    }
                }else if(k == e.ENTER){
                    r = this.doc.selection.createRange();
                    if(r){
                        var target = r.parentElement();
                        if(!target || target.tagName.toLowerCase() != 'li'){
                            e.stopEvent();
                            r.pasteHTML('<br />');
                            r.collapse(false);
                            r.select();
                        }
                    }
                }
            };
        }else if(Wtf.isOpera){
            return function(e){
                var k = e.getKey();
                if(k == e.TAB){
                    e.stopEvent();
                    this.win.focus();
                    this.execCmd('InsertHTML','&nbsp;&nbsp;&nbsp;&nbsp;');
                    this.deferFocus();
                }
            };
        }else if(Wtf.isSafari){
            return function(e){
                var k = e.getKey();
                if(k == e.TAB){
                    e.stopEvent();
                    this.execCmd('InsertText','\t');
                    this.deferFocus();
                }
             };
        }
    }(),

    
    getToolbar : function(){
        return this.tb;
    },

    
    buttonTips : {
        bold : {
            title: 'Bold (Ctrl+B)',
            text: 'Make the selected text bold.',
            cls: 'x-html-editor-tip'
        },
        italic : {
            title: 'Italic (Ctrl+I)',
            text: 'Make the selected text italic.',
            cls: 'x-html-editor-tip'
        },
        underline : {
            title: 'Underline (Ctrl+U)',
            text: 'Underline the selected text.',
            cls: 'x-html-editor-tip'
        },
        increasefontsize : {
            title: 'Grow Text',
            text: 'Increase the font size.',
            cls: 'x-html-editor-tip'
        },
        decreasefontsize : {
            title: 'Shrink Text',
            text: 'Decrease the font size.',
            cls: 'x-html-editor-tip'
        },
        backcolor : {
            title: 'Text Highlight Color',
            text: 'Change the background color of the selected text.',
            cls: 'x-html-editor-tip'
        },
        forecolor : {
            title: 'Font Color',
            text: 'Change the color of the selected text.',
            cls: 'x-html-editor-tip'
        },
        justifyleft : {
            title: 'Align Text Left',
            text: 'Align text to the left.',
            cls: 'x-html-editor-tip'
        },
        justifycenter : {
            title: 'Center Text',
            text: 'Center text in the editor.',
            cls: 'x-html-editor-tip'
        },
        justifyright : {
            title: 'Align Text Right',
            text: 'Align text to the right.',
            cls: 'x-html-editor-tip'
        },
        insertunorderedlist : {
            title: 'Bullet List',
            text: 'Start a bulleted list.',
            cls: 'x-html-editor-tip'
        },
        insertorderedlist : {
            title: 'Numbered List',
            text: 'Start a numbered list.',
            cls: 'x-html-editor-tip'
        },
        createlink : {
            title: 'Hyperlink',
            text: 'Make the selected text a hyperlink.',
            cls: 'x-html-editor-tip'
        },
        sourceedit : {
            title: 'Source Edit',
            text: 'Switch to source editing mode.',
            cls: 'x-html-editor-tip'
        }
    }

    
    
    
    
    
    
    
    
    
    
    
    
    
});
Wtf.reg('htmleditor', Wtf.form.HtmlEditor);

Wtf.form.TimeField = Wtf.extend(Wtf.form.ComboBox, {
    
    minValue : null,
    
    maxValue : null,
    
    minText : "The time in this field must be equal to or after {0}",
    
    maxText : "The time in this field must be equal to or before {0}",
    
    invalidText : "{0} is not a valid time",
    
    format : "g:i A",
    
    altFormats : "g:ia|g:iA|g:i a|g:i A|h:i|g:i|H:i|ga|ha|gA|h a|g a|g A|gi|hi|gia|hia|g|H",
    
    increment: 15,

    
    mode: 'local',
    
    triggerAction: 'all',
    
    typeAhead: false,

    
    initComponent : function(){
        Wtf.form.TimeField.superclass.initComponent.call(this);

        if(typeof this.minValue == "string"){
            this.minValue = this.parseDate(this.minValue);
        }
        if(typeof this.maxValue == "string"){
            this.maxValue = this.parseDate(this.maxValue);
        }

        if(!this.store){
            var min = this.parseDate(this.minValue);
            if(!min){
                min = new Date().clearTime();
            }
            var max = this.parseDate(this.maxValue);
            if(!max){
                max = new Date().clearTime().add('mi', (24 * 60) - 1);
            }
            var times = [];
            while(min <= max){
                times.push([min.dateFormat(this.format)]);
                min = min.add('mi', this.increment);
            }
            this.store = new Wtf.data.SimpleStore({
                fields: ['text'],
                data : times
            });
            this.displayField = 'text';
        }
    },

    
    getValue : function(){
        var v = Wtf.form.TimeField.superclass.getValue.call(this);
        return this.formatDate(this.parseDate(v)) || '';
    },

    
    setValue : function(value){
        Wtf.form.TimeField.superclass.setValue.call(this, this.formatDate(this.parseDate(value)));
    },

    
    validateValue : Wtf.form.DateField.prototype.validateValue,
    parseDate : Wtf.form.DateField.prototype.parseDate,
    formatDate : Wtf.form.DateField.prototype.formatDate,

    
    beforeBlur : function(){
        var v = this.parseDate(this.getRawValue());
        if(v){
            this.setValue(v.dateFormat(this.format));
        }
    }

    
    
    
    
});
Wtf.reg('timefield', Wtf.form.TimeField);

Wtf.form.Action = function(form, options){
    this.form = form;
    this.options = options || {};
};


Wtf.form.Action.CLIENT_INVALID = 'client';

Wtf.form.Action.SERVER_INVALID = 'server';

Wtf.form.Action.CONNECT_FAILURE = 'connect';

Wtf.form.Action.LOAD_FAILURE = 'load';

Wtf.form.Action.prototype = {










    type : 'default',


        run : function(options){

    },

        success : function(response){

    },

        handleResponse : function(response){

    },

        failure : function(response){
        this.response = response;
        this.failureType = Wtf.form.Action.CONNECT_FAILURE;
        this.form.afterAction(this, false);
    },

        processResponse : function(response){
        this.response = response;
        if(!response.responseText){
            return true;
        }
        this.result = this.handleResponse(response);
        return this.result;
    },

        getUrl : function(appendParams){
        var url = this.options.url || this.form.url || this.form.el.dom.action;
        if(appendParams){
            var p = this.getParams();
            if(p){
                url += (url.indexOf('?') != -1 ? '&' : '?') + p;
            }
        }
        return url;
    },

        getMethod : function(){
        return (this.options.method || this.form.method || this.form.el.dom.method || 'POST').toUpperCase();
    },

        getParams : function(){
        var bp = this.form.baseParams;
        var p = this.options.params;
        if(p){
            if(typeof p == "object"){
                p = Wtf.urlEncode(Wtf.applyIf(p, bp));
            }else if(typeof p == 'string' && bp){
                p += '&' + Wtf.urlEncode(bp);
            }
        }else if(bp){
            p = Wtf.urlEncode(bp);
        }
        return p;
    },

        createCallback : function(opts){
		var opts = opts || {};
        return {
            success: this.success,
            failure: this.failure,
            scope: this,
            timeout: (opts.timeout*1000) || (this.form.timeout*1000),
            upload: this.form.fileUpload ? this.success : undefined
        };
    }
};


Wtf.form.Action.Submit = function(form, options){
    Wtf.form.Action.Submit.superclass.constructor.call(this, form, options);
};

Wtf.extend(Wtf.form.Action.Submit, Wtf.form.Action, {
    
    type : 'submit',

        run : function(){
        var o = this.options;
        var method = this.getMethod();
        var isPost = method == 'POST';
        if(o.clientValidation === false || this.form.isValid()){
            Wtf.Ajax.request(Wtf.apply(this.createCallback(o), {
                form:this.form.el.dom,
                url:this.getUrl(!isPost),
                method: method,
                params:isPost ? this.getParams() : null,
                isUpload: this.form.fileUpload
            }));

        }else if (o.clientValidation !== false){             this.failureType = Wtf.form.Action.CLIENT_INVALID;
            this.form.afterAction(this, false);
        }
    },

        success : function(response){
        var result = this.processResponse(response);
        if(result === true || result.success){
            this.form.afterAction(this, true);
            return;
        }
        if(result.errors){
            this.form.markInvalid(result.errors);
            this.failureType = Wtf.form.Action.SERVER_INVALID;
        }
        this.form.afterAction(this, false);
    },

        handleResponse : function(response){
        if(this.form.errorReader){
            var rs = this.form.errorReader.read(response);
            var errors = [];
            if(rs.records){
                for(var i = 0, len = rs.records.length; i < len; i++) {
                    var r = rs.records[i];
                    errors[i] = r.data;
                }
            }
            if(errors.length < 1){
                errors = null;
            }
            return {
                success : rs.success,
                errors : errors
            };
        }
        return Wtf.decode(response.responseText);
    }
});



Wtf.form.Action.Load = function(form, options){
    Wtf.form.Action.Load.superclass.constructor.call(this, form, options);
    this.reader = this.form.reader;
};

Wtf.extend(Wtf.form.Action.Load, Wtf.form.Action, {
        type : 'load',

        run : function(){
        Wtf.Ajax.request(Wtf.apply(
                this.createCallback(this.options), {
                    method:this.getMethod(),
                    url:this.getUrl(false),
                    params:this.getParams()
        }));
    },

        success : function(response){
        var result = this.processResponse(response);
        if(result === true || !result.success || !result.data){
            this.failureType = Wtf.form.Action.LOAD_FAILURE;
            this.form.afterAction(this, false);
            return;
        }
        this.form.clearInvalid();
        this.form.setValues(result.data);
        this.form.afterAction(this, true);
    },

        handleResponse : function(response){
        if(this.form.reader){
            var rs = this.form.reader.read(response);
            var data = rs.records && rs.records[0] ? rs.records[0].data : null;
            return {
                success : rs.success,
                data : data
            };
        }
        return Wtf.decode(response.responseText);
    }
});

Wtf.form.Action.ACTION_TYPES = {
    'load' : Wtf.form.Action.Load,
    'submit' : Wtf.form.Action.Submit
};


Wtf.form.VTypes = function(){
        var alpha = /^[a-zA-Z_]+$/;
    var alphanum = /^[a-zA-Z0-9_]+$/;
    var email = /^([\w]+)(.[\w]+)*@([\w-]+\.){1,5}([A-Za-z]){2,4}$/;
    var url = /(((https?)|(ftp)):\/\/([\-\w]+\.)+\w{2,3}(\/[%\-\w]+(\.\w{2,})?)*(([\w\-\.\?\\\/+@&#;`~=%!]*)(\.\w{2,})?)*\/?)/i;

        return {
        
        'email' : function(v){
            return email.test(v);
        },
        
        'emailText' : 'This field should be an e-mail address in the format "user@domain.com"',
        
        'emailMask' : /[a-z0-9_\.\-@]/i,

        
        'url' : function(v){
            return url.test(v);
        },
        
        'urlText' : 'This field should be a URL in the format "http:/'+'/www.domain.com"',
        
        
        'alpha' : function(v){
            return alpha.test(v);
        },
        
        'alphaText' : 'This field should only contain letters and _',
        
        'alphaMask' : /[a-z_]/i,

        
        'alphanum' : function(v){
            return alphanum.test(v);
        },
        
        'alphanumText' : 'This field should only contain letters, numbers and _',
        
        'alphanumMask' : /[a-z0-9_]/i
    };
}();

Wtf.grid.GridPanel = Wtf.extend(Wtf.Panel, {
    
    
    
    
    
    
    
    
    
    
    

    
    ddText : "{0} selected row{1}",
    
    minColumnWidth : 25,
    
    monitorWindowResize : true,
    
    maxRowsToMeasure : 0,
    
    trackMouseOver : true,
    
    enableDragDrop : false,
    
    enableColumnMove : true,
    
    enableColumnHide : true,
    
    enableHdMenu : true,
    
    enableRowHeightSync : false,
    
    stripeRows : false,
    
    autoExpandColumn : false,
    
    autoExpandMin : 50,
    
    autoExpandMax : 1000,
    
    view : null,
    
    loadMask : false,

    
    rendered : false,
    
    viewReady: false,
    
    stateEvents: ["columnmove", "columnresize", "sortchange"],

    
    initComponent : function(){
        Wtf.grid.GridPanel.superclass.initComponent.call(this);

        
        
        this.autoScroll = false;

        if(this.columns && (this.columns instanceof Array)){
            this.colModel = new Wtf.grid.ColumnModel(this.columns);
            delete this.columns;
        }

        
        if(this.ds){
            this.store = this.ds;
            delete this.ds;
        }
        if(this.cm){
            this.colModel = this.cm;
            delete this.cm;
        }
        if(this.sm){
            this.selModel = this.sm;
            delete this.sm;
        }
        this.store = Wtf.StoreMgr.lookup(this.store);

        this.addEvents(
            
            
            "click",
            
            "dblclick",
            
            "contextmenu",
            
            "mousedown",
            
            "mouseup",
            
            "mouseover",
            
            "mouseout",
            
            "keypress",
            
            "keydown",

            
            
            "cellmousedown",
            
            "rowmousedown",
            
            "headermousedown",

            
            "cellclick",
            
            "celldblclick",
            
            "rowclick",
            
            "rowdblclick",
            
            "headerclick",
            
            "headerdblclick",
            
            "rowcontextmenu",
            
            "cellcontextmenu",
            
            "headercontextmenu",
            
            "bodyscroll",
            
            "columnresize",
            
            "columnmove",
            
            "sortchange"
        );
    },

    
    onRender : function(ct, position){
        Wtf.grid.GridPanel.superclass.onRender.apply(this, arguments);

        var c = this.body;

        this.el.addClass('x-grid-panel');

        var view = this.getView();
        view.init(this);

        c.on("mousedown", this.onMouseDown, this);
        c.on("click", this.onClick, this);
        c.on("dblclick", this.onDblClick, this);
        c.on("contextmenu", this.onContextMenu, this);
        c.on("keydown", this.onKeyDown, this);

        this.relayEvents(c, ["mousedown","mouseup","mouseover","mouseout","keypress"]);

        this.getSelectionModel().init(this);
        this.view.render();
    },

    
    initEvents : function(){
        Wtf.grid.GridPanel.superclass.initEvents.call(this);

        if(this.loadMask){
            this.loadMask = new Wtf.LoadMask(this.bwrap,
                    Wtf.apply({store:this.store}, this.loadMask));
        }
    },

    initStateEvents : function(){
        Wtf.grid.GridPanel.superclass.initStateEvents.call(this);
        this.colModel.on('hiddenchange', this.saveState, this, {delay: 100});
    },

    applyState : function(state){
        var cm = this.colModel;
        var cs = state.columns;
        if(cs){
            for(var i = 0, len = cs.length; i < len; i++){
                var s = cs[i];
                var c = cm.getColumnById(s.id);
                if(c){
                    c.hidden = s.hidden;
                    c.width = s.width;
                    var oldIndex = cm.getIndexById(s.id);
                    if(oldIndex != i){
                        cm.moveColumn(oldIndex, i);
                    }
                }
            }
        }
        if(state.sort){
            this.store[this.store.remoteSort ? 'setDefaultSort' : 'sort'](state.sort.field, state.sort.direction);
        }
    },

    getState : function(){
        var o = {columns: []};
        for(var i = 0, c; c = this.colModel.config[i]; i++){
            o.columns[i] = {
                id: c.id,
                width: c.width
            };
            if(c.hidden){
                o.columns[i].hidden = true;
            }
        }
        var ss = this.store.getSortState();
        if(ss){
            o.sort = ss;
        }
        return o;
    },

    
    afterRender : function(){
        Wtf.grid.GridPanel.superclass.afterRender.call(this);
        this.view.layout();
        this.viewReady = true;
    },

    
    reconfigure : function(store, colModel){
        if(this.loadMask){
            this.loadMask.destroy();
            this.loadMask = new Wtf.LoadMask(this.bwrap,
                    Wtf.apply({store:store}, this.initialConfig.loadMask));
        }
        this.view.bind(store, colModel);
        this.store = store;
        this.colModel = colModel;
        if(this.rendered){
            this.view.refresh(true);
        }
    },

    
    onKeyDown : function(e){
        this.fireEvent("keydown", e);
    },

    
    onDestroy : function(){
        if(this.rendered){
            if(this.loadMask){
                this.loadMask.destroy();
            }
            var c = this.body;
            c.removeAllListeners();
            this.view.destroy();
            c.update("");
        }
        this.colModel.purgeListeners();
        Wtf.grid.GridPanel.superclass.onDestroy.call(this);
    },

    
    processEvent : function(name, e){
        this.fireEvent(name, e);
        var t = e.getTarget();
        var v = this.view;
        var header = v.findHeaderIndex(t);
        if(header !== false){
            this.fireEvent("header" + name, this, header, e);
        }else{
            var row = v.findRowIndex(t);
            var cell = v.findCellIndex(t);
            if(row !== false){
                this.fireEvent("row" + name, this, row, e);
                if(cell !== false){
                    this.fireEvent("cell" + name, this, row, cell, e);
                }
            }
        }
    },

    
    onClick : function(e){
        this.processEvent("click", e);
    },

    
    onMouseDown : function(e){
        this.processEvent("mousedown", e);
    },

    
    onContextMenu : function(e, t){
        this.processEvent("contextmenu", e);
    },

    
    onDblClick : function(e){
        this.processEvent("dblclick", e);
    },

    
    walkCells : function(row, col, step, fn, scope){
        var cm = this.colModel, clen = cm.getColumnCount();
        var ds = this.store, rlen = ds.getCount(), first = true;
        if(step < 0){
            if(col < 0){
                row--;
                first = false;
            }
            while(row >= 0){
                if(!first){
                    col = clen-1;
                }
                first = false;
                while(col >= 0){
                    if(fn.call(scope || this, row, col, cm) === true){
                        return [row, col];
                    }
                    col--;
                }
                row--;
            }
        } else {
            if(col >= clen){
                row++;
                first = false;
            }
            while(row < rlen){
                if(!first){
                    col = 0;
                }
                first = false;
                while(col < clen){
                    if(fn.call(scope || this, row, col, cm) === true){
                        return [row, col];
                    }
                    col++;
                }
                row++;
            }
        }
        return null;
    },

    
    getSelections : function(){
        return this.selModel.getSelections();
    },

    
    onResize : function(){
        Wtf.grid.GridPanel.superclass.onResize.apply(this, arguments);
        if(this.viewReady){
            this.view.layout();
        }
    },

    
    getGridEl : function(){
        return this.body;
    },

    
    stopEditing : function(){},

    
    getSelectionModel : function(){
        if(!this.selModel){
            this.selModel = new Wtf.grid.RowSelectionModel(
                    this.disableSelection ? {selectRow: Wtf.emptyFn} : null);
        }
        return this.selModel;
    },

    
    getStore : function(){
        return this.store;
    },

    
    getColumnModel : function(){
        return this.colModel;
    },

    
    getView : function(){
        if(!this.view){
            this.view = new Wtf.grid.GridView(this.viewConfig);
        }
        return this.view;
    },
    
    getDragDropText : function(){
        var count = this.selModel.getCount();
        return String.format(this.ddText, count, count == 1 ? '' : 's');
    }

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
});
Wtf.reg('grid', Wtf.grid.GridPanel);

Wtf.grid.GridView = function(config){
    Wtf.apply(this, config);
        this.addEvents(
	    
	    "beforerowremoved",
	    
	    "beforerowsinserted",
	    
	    "beforerefresh",
	    
	    "rowremoved",
	    
	    "rowsinserted",
	    
	    "rowupdated",
	    
	    "refresh"
	);
    Wtf.grid.GridView.superclass.constructor.call(this);
};

Wtf.extend(Wtf.grid.GridView, Wtf.util.Observable, {
    
    
    
    
    scrollOffset: 19,
    
    autoFill: false,
    
    forceFit: false,
    
    sortClasses : ["sort-asc", "sort-desc"],
    
    sortAscText : "Sort Ascending",
    
    sortDescText : "Sort Descending",
    
    columnsText : "Columns",

        borderWidth: 2,

    

        initTemplates : function(){
        var ts = this.templates || {};
        if(!ts.master){
            ts.master = new Wtf.Template(
                    '<div class="x-grid3" hidefocus="true">',
                        '<div class="x-grid3-viewport">',
                            '<div class="x-grid3-header"><div class="x-grid3-header-inner"><div class="x-grid3-header-offset">{header}</div></div><div class="x-clear"></div></div>',
                            '<div class="x-grid3-scroller"><div class="x-grid3-body">{body}</div><a href="#" class="x-grid3-focus" tabIndex="-1"></a></div>',
                        "</div>",
                        '<div class="x-grid3-resize-marker">&#160;</div>',
                        '<div class="x-grid3-resize-proxy">&#160;</div>',
                    "</div>"
                    );
        }

        if(!ts.header){
            ts.header = new Wtf.Template(
                    '<table border="0" cellspacing="0" cellpadding="0" style="{tstyle}">',
                    '<thead><tr class="x-grid3-hd-row">{cells}</tr></thead>',
                    "</table>"
                    );
        }

        if(!ts.hcell){
            ts.hcell = new Wtf.Template(
                    '<td class="x-grid3-hd x-grid3-cell x-grid3-td-{id}" style="{style}"><div {attr} class="x-grid3-hd-inner x-grid3-hd-{id}" unselectable="on" style="{istyle}">', this.grid.enableHdMenu ? '<a class="x-grid3-hd-btn" href="#"></a>' : '',
                    '{value}<img class="x-grid3-sort-icon" src="', Wtf.BLANK_IMAGE_URL, '" />',
                    "</div></td>"
                    );
        }

        if(!ts.body){
            ts.body = new Wtf.Template('{rows}');
        }

        if(!ts.row){
            ts.row = new Wtf.Template(
                    '<div class="x-grid3-row {alt}" style="{tstyle}"><table class="x-grid3-row-table" border="0" cellspacing="0" cellpadding="0" style="{tstyle}">',
                    '<tbody><tr>{cells}</tr>',
                    (this.enableRowBody ? '<tr class="x-grid3-row-body-tr" style="{bodyStyle}"><td colspan="{cols}" class="x-grid3-body-cell" tabIndex="0" hidefocus="on"><div class="x-grid3-row-body">{body}</div></td></tr>' : ''),
                    '</tbody></table></div>'
                    );
        }

        if(!ts.cell){
            ts.cell = new Wtf.Template(
                    '<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} {css}" style="{style}" tabIndex="0" {cellAttr}>',
                    '<div class="x-grid3-cell-inner x-grid3-col-{id}" unselectable="on" {attr}>{value}</div>',
                    "</td>"
                    );
        }

        for(var k in ts){
            var t = ts[k];
            if(t && typeof t.compile == 'function' && !t.compiled){
                t.disableFormats = true;
                t.compile();
            }
        }

        this.templates = ts;

        this.tdClass = 'x-grid3-cell';
        this.cellSelector = 'td.x-grid3-cell';
        this.hdCls = 'x-grid3-hd';
        this.rowSelector = 'div.x-grid3-row';
        this.colRe = new RegExp("x-grid3-td-([^\\s]+)", "");
    },

        fly : function(el){
        if(!this._flyweight){
            this._flyweight = new Wtf.Element.Flyweight(document.body);
        }
        this._flyweight.dom = el;
        return this._flyweight;
    },

        getEditorParent : function(ed){
        return this.scroller.dom;
    },

        initElements : function(){
        var E = Wtf.Element;

        var el = this.grid.getGridEl().dom.firstChild;
	    var cs = el.childNodes;

	    this.el = new E(el);

        this.mainWrap = new E(cs[0]);
	    this.mainHd = new E(this.mainWrap.dom.firstChild);
	    this.innerHd = this.mainHd.dom.firstChild;
        this.scroller = new E(this.mainWrap.dom.childNodes[1]);
        if(this.forceFit){
            this.scroller.setStyle('overflow-x', 'hidden');
        }
        this.mainBody = new E(this.scroller.dom.firstChild);

	    this.focusEl = new E(this.scroller.dom.childNodes[1]);
        this.focusEl.swallowEvent("click", true);

        this.resizeMarker = new E(cs[1]);
        this.resizeProxy = new E(cs[2]);
    },

        getRows : function(){
        return this.hasRows() ? this.mainBody.dom.childNodes : [];
    },

    
        findCell : function(el){
        if(!el){
            return false;
        }
        return this.fly(el).findParent(this.cellSelector, 3);
    },

        findCellIndex : function(el, requiredCls){
        var cell = this.findCell(el);
        if(cell && (!requiredCls || this.fly(cell).hasClass(requiredCls))){
            return this.getCellIndex(cell);
        }
        return false;
    },

        getCellIndex : function(el){
        if(el){
            var m = el.className.match(this.colRe);
            if(m && m[1]){
                return this.cm.getIndexById(m[1]);
            }
        }
        return false;
    },

        findHeaderCell : function(el){
        var cell = this.findCell(el);
        return cell && this.fly(cell).hasClass(this.hdCls) ? cell : null;
    },

        findHeaderIndex : function(el){
        return this.findCellIndex(el, this.hdCls);
    },

        findRow : function(el){
        if(!el){
            return false;
        }
        return this.fly(el).findParent(this.rowSelector, 10);
    },

        findRowIndex : function(el){
        var r = this.findRow(el);
        return r ? r.rowIndex : false;
    },

    

    getRow : function(row){
        return this.getRows()[row];
    },


    getCell : function(row, col){
        return this.getRow(row).getElementsByTagName('td')[col];
	},


    getHeaderCell : function(index){
	    return this.mainHd.dom.getElementsByTagName('td')[index];
	},

    
        addRowClass : function(row, cls){
        var r = this.getRow(row);
        if(r){
            this.fly(r).addClass(cls);
        }
    },

        removeRowClass : function(row, cls){
        var r = this.getRow(row);
        if(r){
            this.fly(r).removeClass(cls);
        }
    },

        removeRow : function(row){
        Wtf.removeNode(this.getRow(row));
    },

        removeRows : function(firstRow, lastRow){
        var bd = this.mainBody.dom;
        for(var rowIndex = firstRow; rowIndex <= lastRow; rowIndex++){
            Wtf.removeNode(bd.childNodes[firstRow]);
        }
    },

    
        getScrollState : function(){
        var sb = this.scroller.dom;
        return {left: sb.scrollLeft, top: sb.scrollTop};
    },

        restoreScroll : function(state){
        var sb = this.scroller.dom;
        sb.scrollLeft = state.left;
        sb.scrollTop = state.top;
    },

    
    scrollToTop : function(){
        this.scroller.dom.scrollTop = 0;
        this.scroller.dom.scrollLeft = 0;
    },

        syncScroll : function(){
        var mb = this.scroller.dom;
        this.innerHd.scrollLeft = mb.scrollLeft;
        this.innerHd.scrollLeft = mb.scrollLeft;         this.grid.fireEvent("bodyscroll", mb.scrollLeft, mb.scrollTop);
    },

        updateSortIcon : function(col, dir){
        var sc = this.sortClasses;
        var hds = this.mainHd.select('td').removeClass(sc);
        hds.item(col).addClass(sc[dir == "DESC" ? 1 : 0]);
    },

        updateAllColumnWidths : function(){
        var tw = this.getTotalWidth();
        var clen = this.cm.getColumnCount();
        var ws = [];
        for(var i = 0; i < clen; i++){
            ws[i] = this.getColumnWidth(i);
        }

        this.innerHd.firstChild.firstChild.style.width = tw;

        for(var i = 0; i < clen; i++){
            var hd = this.getHeaderCell(i);
            hd.style.width = ws[i];
        }

        var ns = this.getRows();
        for(var i = 0, len = ns.length; i < len; i++){
            ns[i].style.width = tw;
            ns[i].firstChild.style.width = tw;
            var row = ns[i].firstChild.rows[0];
            for(var j = 0; j < clen; j++){
                row.childNodes[j].style.width = ws[j];
            }
        }

        this.onAllColumnWidthsUpdated(ws, tw);
    },

        updateColumnWidth : function(col, width){
        var w = this.getColumnWidth(col);
        var tw = this.getTotalWidth();

        this.innerHd.firstChild.firstChild.style.width = tw;
        var hd = this.getHeaderCell(col);
        hd.style.width = w;

        var ns = this.getRows();
        for(var i = 0, len = ns.length; i < len; i++){
            ns[i].style.width = tw;
            ns[i].firstChild.style.width = tw;
            ns[i].firstChild.rows[0].childNodes[col].style.width = w;
        }

        this.onColumnWidthUpdated(col, w, tw);
    },

        updateColumnHidden : function(col, hidden){
        var tw = this.getTotalWidth();

        this.innerHd.firstChild.firstChild.style.width = tw;

        var display = hidden ? 'none' : '';

        var hd = this.getHeaderCell(col);
        hd.style.display = display;

        var ns = this.getRows();
        for(var i = 0, len = ns.length; i < len; i++){
            ns[i].style.width = tw;
            ns[i].firstChild.style.width = tw;
            ns[i].firstChild.rows[0].childNodes[col].style.display = display;
        }

        this.onColumnHiddenUpdated(col, hidden, tw);

        delete this.lastViewWidth;         this.layout();
    },

        doRender : function(cs, rs, ds, startRow, colCount, stripe){
        var ts = this.templates, ct = ts.cell, rt = ts.row, last = colCount-1;
        var tstyle = 'width:'+this.getTotalWidth()+';';
        
                var buf = [], cb, c, p = {}, rp = {tstyle: tstyle}, r;
        for(var j = 0, len = rs.length; j < len; j++){
            r = rs[j]; cb = [];
            var rowIndex = (j+startRow);
            
            for(var i = 0; i < colCount; i++){
                c = cs[i];
                p.id = c.id;
                p.css = i == 0 ? 'x-grid3-cell-first ' : (i == last ? 'x-grid3-cell-last ' : '');
                p.attr = p.cellAttr = "";
                p.value = c.renderer(r.data[c.name], p, r, rowIndex, i, ds);
                p.style = c.style;
                if(p.value == undefined || p.value === "") p.value = "&#160;";
                if(r.dirty && typeof r.modified[c.name] !== 'undefined'){
                    p.css += ' x-grid3-dirty-cell';
                }
                cb[cb.length] = ct.apply(p);
            }
            var alt = [];
            if(stripe && ((rowIndex+1) % 2 == 0)){
                alt[0] = "x-grid3-row-alt";
            }
            if(r.dirty){
                alt[1] = " x-grid3-dirty-row";
            }
            rp.cols = colCount;
            if(this.getRowClass){
                alt[2] = this.getRowClass(r, rowIndex, rp, ds);
            }
            rp.alt = alt.join(" ");
            rp.cells = cb.join("");
            buf[buf.length] =  rt.apply(rp);
        }
        return buf.join("");
    },

        processRows : function(startRow, skipStripe){
        if(this.ds.getCount() < 1){
            return;
        }
        skipStripe = skipStripe || !this.grid.stripeRows;
        startRow = startRow || 0;
        var rows = this.getRows();
        var cls = ' x-grid3-row-alt ';
        for(var i = startRow, len = rows.length; i < len; i++){
            var row = rows[i];
            row.rowIndex = i;
            if(!skipStripe){
                var isAlt = ((i+1) % 2 == 0);
                var hasAlt = (' '+row.className + ' ').indexOf(cls) != -1;
                if(isAlt == hasAlt){
                    continue;
                }
                if(isAlt){
                    row.className += " x-grid3-row-alt";
                }else{
                    row.className = row.className.replace("x-grid3-row-alt", "");
                }
            }
        }
    },

        renderUI : function(){

        var header = this.renderHeaders();
        var body = this.templates.body.apply({rows:''});


        var html = this.templates.master.apply({
            body: body,
            header: header
        });

        var g = this.grid;

        g.getGridEl().dom.innerHTML = html;

        this.initElements();


        this.mainBody.dom.innerHTML = this.renderRows();
        this.processRows(0, true);


                Wtf.fly(this.innerHd).on("click", this.handleHdDown, this);
        this.mainHd.on("mouseover", this.handleHdOver, this);
        this.mainHd.on("mouseout", this.handleHdOut, this);
        this.mainHd.on("mousemove", this.handleHdMove, this);

        this.scroller.on('scroll', this.syncScroll,  this);
        if(g.enableColumnResize !== false){
            this.splitone = new Wtf.grid.GridView.SplitDragZone(g, this.mainHd.dom);
        }

        if(g.enableColumnMove){
            this.columnDrag = new Wtf.grid.GridView.ColumnDragZone(g, this.innerHd);
            this.columnDrop = new Wtf.grid.HeaderDropZone(g, this.mainHd.dom);
        }

        if(g.enableHdMenu !== false){
            if(g.enableColumnHide !== false){
                this.colMenu = new Wtf.menu.Menu({id:g.id + "-hcols-menu"});
                this.colMenu.on("beforeshow", this.beforeColMenuShow, this);
                this.colMenu.on("itemclick", this.handleHdMenuClick, this);
            }
            this.hmenu = new Wtf.menu.Menu({id: g.id + "-hctx"});
            this.hmenu.add(
                {id:"asc", text: this.sortAscText, cls: "xg-hmenu-sort-asc"},
                {id:"desc", text: this.sortDescText, cls: "xg-hmenu-sort-desc"}
            );
            if(g.enableColumnHide !== false){
                this.hmenu.add('-',
                    {id:"columns", text: this.columnsText, menu: this.colMenu, iconCls: 'x-cols-icon'}
                );
            }
            this.hmenu.on("itemclick", this.handleHdMenuClick, this);

                    }

        if(g.enableDragDrop || g.enableDrag){
            var dd = new Wtf.grid.GridDragZone(g, {
                ddGroup : g.ddGroup || 'GridDD'
            });
        }

        this.updateHeaderSortState();

    },

        layout : function(){
        if(!this.mainBody){
            return;         }
        var g = this.grid;
        var c = g.getGridEl(), cm = this.cm,
                expandCol = g.autoExpandColumn,
                gv = this;

        var csize = c.getSize(true);
        var vw = csize.width;

        if(vw < 20 || csize.height < 20){             return;
        }

        if(g.autoHeight){
            this.scroller.dom.style.overflow = 'visible';
        }else{
            this.el.setSize(csize.width, csize.height);

            var hdHeight = this.mainHd.getHeight();
            var vh = csize.height - (hdHeight);

            this.scroller.setSize(vw, vh);
            if(this.innerHd){
                this.innerHd.style.width = (vw)+'px';
            }
        }
        if(this.forceFit){
            if(this.lastViewWidth != vw){
                this.fitColumns(false, false);
                this.lastViewWidth = vw;
            }
        }else {
            this.autoExpand();
        }
        this.onLayout(vw, vh);
    },

            onLayout : function(vw, vh){
            },

    onColumnWidthUpdated : function(col, w, tw){
            },

    onAllColumnWidthsUpdated : function(ws, tw){
            },

    onColumnHiddenUpdated : function(col, hidden, tw){
            },

    updateColumnText : function(col, text){
            },

    afterMove : function(colIndex){
            },

    
        init: function(grid){
        this.grid = grid;

        this.initTemplates();
        this.initData(grid.store, grid.colModel);
        this.initUI(grid);
	},

        getColumnId : function(index){
	    return this.cm.getColumnId(index);
	},

        renderHeaders : function(){
	    var cm = this.cm, ts = this.templates;
        var ct = ts.hcell;

        var cb = [], sb = [], p = {};

        for(var i = 0, len = cm.getColumnCount(); i < len; i++){
            p.id = cm.getColumnId(i);
            p.value = cm.getColumnHeader(i) || "";
            p.style = this.getColumnStyle(i, true);
            if(cm.config[i].align == 'right'){
                p.istyle = 'padding-right:16px';
            }
            cb[cb.length] = ct.apply(p);
        }
        return ts.header.apply({cells: cb.join(""), tstyle:'width:'+this.getTotalWidth()+';'});
	},

        beforeUpdate : function(){
        this.grid.stopEditing();
    },

        updateHeaders : function(){
        this.innerHd.firstChild.innerHTML = this.renderHeaders();
    },

    
    focusRow : function(row){
        this.focusCell(row, 0, false);
    },

    
    focusCell : function(row, col, hscroll){
        var el = this.ensureVisible(row, col, hscroll);
        if(el){
            this.focusEl.alignTo(el, "tl-tl");
            if(Wtf.isGecko){
                this.focusEl.focus();
            }else{
                this.focusEl.focus.defer(1, this.focusEl);
            }
        }
    },

        ensureVisible : function(row, col, hscroll){
        if(typeof row != "number"){
            row = row.rowIndex;
        }
        if(row < 0 || row >= this.ds.getCount()){
            return;
        }
        col = (col !== undefined ? col : 0);

        var rowEl = this.getRow(row), cellEl;
        if(!(hscroll === false && col === 0)){
            while(this.cm.isHidden(col)){
                col++;
            }
            cellEl = this.getCell(row, col);
        }
        if(!rowEl){
            return;
        }

        var c = this.scroller.dom;

        var ctop = 0;
        var p = rowEl, stop = this.el.dom;
        while(p && p != stop){
            ctop += p.offsetTop;
            p = p.offsetParent;
        }
        ctop -= this.mainHd.dom.offsetHeight;

        var cbot = ctop + rowEl.offsetHeight;

        var ch = c.clientHeight;
        var stop = parseInt(c.scrollTop, 10);
        var sbot = stop + ch;

        if(ctop < stop){
        	c.scrollTop = ctop;
        }else if(cbot > sbot){
            c.scrollTop = cbot-ch;
        }

        if(hscroll !== false){
            var cleft = parseInt(cellEl.offsetLeft, 10);
            var cright = cleft + cellEl.offsetWidth;

            var sleft = parseInt(c.scrollLeft, 10);
            var sright = sleft + c.clientWidth;
            if(cleft < sleft){
                c.scrollLeft = cleft;
            }else if(cright > sright){
                c.scrollLeft = cright-c.clientWidth;
            }
        }
        return cellEl || rowEl;
    },

        insertRows : function(dm, firstRow, lastRow, isUpdate){
        if(firstRow === 0 && lastRow == dm.getCount()-1){
            this.refresh();
        }else{
            if(!isUpdate){
                this.fireEvent("beforerowsinserted", this, firstRow, lastRow);
            }
            var html = this.renderRows(firstRow, lastRow);
            var before = this.getRow(firstRow);
            if(before){
                Wtf.DomHelper.insertHtml('beforeBegin', before, html);
            }else{
                Wtf.DomHelper.insertHtml('beforeEnd', this.mainBody.dom, html);
            }
            if(!isUpdate){
                this.fireEvent("rowsinserted", this, firstRow, lastRow);
                this.processRows(firstRow);
            }
        }
    },

        deleteRows : function(dm, firstRow, lastRow){
        if(dm.getRowCount()<1){
            this.refresh();
        }else{
            this.fireEvent("beforerowsdeleted", this, firstRow, lastRow);

            this.removeRows(firstRow, lastRow);

            this.processRows(firstRow);
            this.fireEvent("rowsdeleted", this, firstRow, lastRow);
        }
    },

        getColumnStyle : function(col, isHeader){
        var style = !isHeader ? (this.cm.config[col].css || '') : '';
        style += 'width:'+this.getColumnWidth(col)+';';
        if(this.cm.isHidden(col)){
            style += 'display:none;';
        }
        var align = this.cm.config[col].align;
        if(align){
            style += 'text-align:'+align+';';
        }
        return style;
    },

        getColumnWidth : function(col){
        var w = this.cm.getColumnWidth(col);
        if(typeof w == 'number'){
            return (Wtf.isBorderBox ? w : (w-this.borderWidth > 0 ? w-this.borderWidth:0)) + 'px';
        }
        return w;
    },

        getTotalWidth : function(){
        return this.cm.getTotalWidth()+'px';
    },

        fitColumns : function(preventRefresh, onlyExpand, omitColumn){
        var cm = this.cm, leftOver, dist, i;
        var tw = cm.getTotalWidth(false);
        var aw = this.grid.getGridEl().getWidth(true)-this.scrollOffset;

        if(aw < 20){             return;
        }
        var extra = aw - tw;

        if(extra === 0){
            return false;
        }

        var vc = cm.getColumnCount(true);
        var ac = vc-(typeof omitColumn == 'number' ? 1 : 0);
        if(ac === 0){
            ac = 1;
            omitColumn = undefined;
        }
        var colCount = cm.getColumnCount();
        var cols = [];
        var extraCol = 0;
        var width = 0;
        var w;
        for (i = 0; i < colCount; i++){
            if(!cm.isHidden(i) && !cm.isFixed(i) && i !== omitColumn){
                w = cm.getColumnWidth(i);
                cols.push(i);
                extraCol = i;
                cols.push(w);
                width += w;
            }
        }
        var frac = (aw - cm.getTotalWidth())/width;
        while (cols.length){
            w = cols.pop();
            i = cols.pop();
            cm.setColumnWidth(i, Math.max(this.grid.minColumnWidth, Math.floor(w + w*frac)), true);
        }

        if((tw = cm.getTotalWidth(false)) > aw){
            var adjustCol = ac != vc ? omitColumn : extraCol;
             cm.setColumnWidth(adjustCol, Math.max(1,
                     cm.getColumnWidth(adjustCol)- (tw-aw)), true);       
        }

        if(preventRefresh !== true){
            this.updateAllColumnWidths();
        }

        
        return true;
    },

        autoExpand : function(preventUpdate){
        var g = this.grid, cm = this.cm;
        if(!this.userResized && g.autoExpandColumn){
            var tw = cm.getTotalWidth(false);
            var aw = this.grid.getGridEl().getWidth(true)-this.scrollOffset;
            if(tw != aw){
                var ci = cm.getIndexById(g.autoExpandColumn);
                var currentWidth = cm.getColumnWidth(ci);
                var cw = Math.min(Math.max(((aw-tw)+currentWidth), g.autoExpandMin), g.autoExpandMax);
                if(cw != currentWidth){
                    cm.setColumnWidth(ci, cw, true);
                    if(preventUpdate !== true){
                        this.updateColumnWidth(ci, cw);
                    }
                }
            }

        }
    },

        getColumnData : function(){
                var cs = [], cm = this.cm, colCount = cm.getColumnCount();
        for(var i = 0; i < colCount; i++){
            var name = cm.getDataIndex(i);
            cs[i] = {
                name : (typeof name == 'undefined' ? this.ds.fields.get(i).name : name),
                renderer : cm.getRenderer(i),
                id : cm.getColumnId(i),
                style : this.getColumnStyle(i)
            };
        }
        return cs;
    },

        renderRows : function(startRow, endRow){
                var g = this.grid, cm = g.colModel, ds = g.store, stripe = g.stripeRows;
        var colCount = cm.getColumnCount();

        if(ds.getCount() < 1){
            return "";
        }

        var cs = this.getColumnData();

        startRow = startRow || 0;
        endRow = typeof endRow == "undefined"? ds.getCount()-1 : endRow;

                var rs = ds.getRange(startRow, endRow);

        return this.doRender(cs, rs, ds, startRow, colCount, stripe);
    },

        renderBody : function(){
        var markup = this.renderRows();
        return this.templates.body.apply({rows: markup});
    },

        refreshRow : function(record){
        var ds = this.ds, index;
        if(typeof record == 'number'){
            index = record;
            record = ds.getAt(index);
        }else{
            index = ds.indexOf(record);
        }
        var cls = [];
        this.insertRows(ds, index, index, true);
        this.getRow(index).rowIndex = index;
        this.onRemove(ds, record, index+1, true);
        this.fireEvent("rowupdated", this, index, record);
    },

    
    refresh : function(headersToo){
        this.fireEvent("beforerefresh", this);
        this.grid.stopEditing();

        var result = this.renderBody();
        this.mainBody.update(result);

        if(headersToo === true){
            this.updateHeaders();
            this.updateHeaderSortState();
        }
        this.processRows(0, true);
        this.layout();
        this.applyEmptyText();
        this.fireEvent("refresh", this);
    },

        applyEmptyText : function(){
        if(this.emptyText && !this.hasRows()){
            this.mainBody.update('<div class="x-grid-empty">' + this.emptyText + '</div>');
        }
    },

        updateHeaderSortState : function(){
        var state = this.ds.getSortState();
        if(!state){
            return;
        }
        if(!this.sortState || (this.sortState.field != state.field || this.sortState.direction != state.direction)){
            this.grid.fireEvent('sortchange', this.grid, state);
        }
        this.sortState = state;
        var sortColumn = this.cm.findColumnIndex(state.field);
        if(sortColumn != -1){
            var sortDir = state.direction;
            this.updateSortIcon(sortColumn, sortDir);
        }
    },

        destroy : function(){
        if(this.colMenu){
            this.colMenu.removeAll();
            Wtf.menu.MenuMgr.unregister(this.colMenu);
            this.colMenu.getEl().remove();
            delete this.colMenu;
        }
        if(this.hmenu){
            this.hmenu.removeAll();
            Wtf.menu.MenuMgr.unregister(this.hmenu);
            this.hmenu.getEl().remove();
            delete this.hmenu;
        }
        if(this.grid.enableColumnMove){
            var dds = Wtf.dd.DDM.ids['gridHeader' + this.grid.getGridEl().id];
            if(dds){
                for(var dd in dds){
                    if(!dds[dd].config.isTarget && dds[dd].dragElId){
                        var elid = dds[dd].dragElId;
                        dds[dd].unreg();
                        Wtf.get(elid).remove();
                    } else if(dds[dd].config.isTarget){
                        dds[dd].proxyTop.remove();
                        dds[dd].proxyBottom.remove();
                        dds[dd].unreg();
                    }
                    if(Wtf.dd.DDM.locationCache[dd]){
                        delete Wtf.dd.DDM.locationCache[dd];
                    }
                }
                delete Wtf.dd.DDM.ids['gridHeader' + this.grid.getGridEl().id];
            }
        }

        Wtf.destroy(this.resizeMarker, this.resizeProxy);

        this.initData(null, null);
        Wtf.EventManager.removeResizeListener(this.onWindowResize, this);
    },

        onDenyColumnHide : function(){

    },

        render : function(){

        var cm = this.cm;
        var colCount = cm.getColumnCount();

        if(this.grid.monitorWindowResize === true){
            Wtf.EventManager.onWindowResize(this.onWindowResize, this, true);
        }

        if(this.autoFill){
            this.fitColumns(true, true);
        }else if(this.forceFit){
            this.fitColumns(true, false);
        }else if(this.grid.autoExpandColumn){
            this.autoExpand(true);
        }

        this.renderUI();

            },

        onWindowResize : function(){
        if(!this.grid.monitorWindowResize || this.grid.autoHeight){
            return;
        }
        this.layout();
    },

    
        initData : function(ds, cm){
        if(this.ds){
            this.ds.un("load", this.onLoad, this);
            this.ds.un("datachanged", this.onDataChange, this);
            this.ds.un("add", this.onAdd, this);
            this.ds.un("remove", this.onRemove, this);
            this.ds.un("update", this.onUpdate, this);
            this.ds.un("clear", this.onClear, this);
        }
        if(ds){
            ds.on("load", this.onLoad, this);
            ds.on("datachanged", this.onDataChange, this);
            ds.on("add", this.onAdd, this);
            ds.on("remove", this.onRemove, this);
            ds.on("update", this.onUpdate, this);
            ds.on("clear", this.onClear, this);
        }
        this.ds = ds;

        if(this.cm){
            this.cm.un("configchange", this.onColConfigChange, this);
            this.cm.un("widthchange", this.onColWidthChange, this);
            this.cm.un("headerchange", this.onHeaderChange, this);
            this.cm.un("hiddenchange", this.onHiddenChange, this);
            this.cm.un("columnmoved", this.onColumnMove, this);
            this.cm.un("columnlockchange", this.onColumnLock, this);
        }
        if(cm){
            cm.on("configchange", this.onColConfigChange, this);
            cm.on("widthchange", this.onColWidthChange, this);
            cm.on("headerchange", this.onHeaderChange, this);
            cm.on("hiddenchange", this.onHiddenChange, this);
            cm.on("columnmoved", this.onColumnMove, this);
            cm.on("columnlockchange", this.onColumnLock, this);
        }
        this.cm = cm;
    },

        onDataChange : function(){
        this.refresh();
        this.updateHeaderSortState();
    },

        onClear : function(){
        this.refresh();
    },

        onUpdate : function(ds, record){
        this.refreshRow(record);
    },

        onAdd : function(ds, records, index){
        this.insertRows(ds, index, index + (records.length-1));
    },

        onRemove : function(ds, record, index, isUpdate){
        if(isUpdate !== true){
            this.fireEvent("beforerowremoved", this, index, record);
        }
        this.removeRow(index);
        if(isUpdate !== true){
            this.processRows(index);
            this.applyEmptyText();
            this.fireEvent("rowremoved", this, index, record);
        }
    },

        onLoad : function(){
        this.scrollToTop();
    },

        onColWidthChange : function(cm, col, width){
        this.updateColumnWidth(col, width);
    },

        onHeaderChange : function(cm, col, text){
        this.updateHeaders();
    },

        onHiddenChange : function(cm, col, hidden){
        this.updateColumnHidden(col, hidden);
    },

        onColumnMove : function(cm, oldIndex, newIndex){
        this.indexMap = null;
        var s = this.getScrollState();
        this.refresh(true);
        this.restoreScroll(s);
        this.afterMove(newIndex);
    },

        onColConfigChange : function(){
        delete this.lastViewWidth;
        this.indexMap = null;
        this.refresh(true);  
    },

    
        initUI : function(grid){
        grid.on("headerclick", this.onHeaderClick, this);

        if(grid.trackMouseOver){
            grid.on("mouseover", this.onRowOver, this);
	        grid.on("mouseout", this.onRowOut, this);
	    }
    },

        initEvents : function(){

    },

        onHeaderClick : function(g, index){
        if(this.headersDisabled || !this.cm.isSortable(index)){
            return;
        }
	    g.stopEditing();
        g.store.sort(this.cm.getDataIndex(index));
    },

        onRowOver : function(e, t){
        var row;
        if((row = this.findRowIndex(t)) !== false){
            this.addRowClass(row, "x-grid3-row-over");
        }
    },

        onRowOut : function(e, t){
        var row;
        if((row = this.findRowIndex(t)) !== false && row !== this.findRowIndex(e.getRelatedTarget())){
            this.removeRowClass(row, "x-grid3-row-over");
        }
    },

        handleWheel : function(e){
        e.stopPropagation();
    },

        onRowSelect : function(row){
        this.addRowClass(row, "x-grid3-row-selected");
    },

        onRowDeselect : function(row){
        this.removeRowClass(row, "x-grid3-row-selected");
    },

        onCellSelect : function(row, col){
        var cell = this.getCell(row, col);
        if(cell){
            this.fly(cell).addClass("x-grid3-cell-selected");
        }
    },

        onCellDeselect : function(row, col){
        var cell = this.getCell(row, col);
        if(cell){
            this.fly(cell).removeClass("x-grid3-cell-selected");
        }
    },

        onColumnSplitterMoved : function(i, w){
        this.userResized = true;
        var cm = this.grid.colModel;
        cm.setColumnWidth(i, w, true);

        if(this.forceFit){
            this.fitColumns(true, false, i);
            this.updateAllColumnWidths();
        }else{
            this.updateColumnWidth(i, w);
        }

        this.grid.fireEvent("columnresize", i, w);
    },

        handleHdMenuClick : function(item){
        var index = this.hdCtxIndex;
        var cm = this.cm, ds = this.ds;
        switch(item.id){
            case "asc":
                ds.sort(cm.getDataIndex(index), "ASC");
                break;
            case "desc":
                ds.sort(cm.getDataIndex(index), "DESC");
                break;
            default:
                index = cm.getIndexById(item.id.substr(4));
                if(index != -1){
                    if(item.checked && cm.getColumnsBy(this.isHideableColumn, this).length <= 1){
                        this.onDenyColumnHide();
                        return false;
                    }
                    cm.setHidden(index, item.checked);
                }
        }
        return true;
    },

        isHideableColumn : function(c){
        return !c.hidden && !c.fixed;
    },

        beforeColMenuShow : function(){
        var cm = this.cm,  colCount = cm.getColumnCount();
        this.colMenu.removeAll();
        for(var i = 0; i < colCount; i++){
            if(cm.config[i].fixed !== true && cm.config[i].hideable !== false){
                this.colMenu.add(new Wtf.menu.CheckItem({
                    id: "col-"+cm.getColumnId(i),
                    text: cm.getColumnHeader(i),
                    checked: !cm.isHidden(i),
                    hideOnClick:false,
                    disabled: cm.config[i].hideable === false
                }));
            }
        }
    },

        handleHdDown : function(e, t){
        if(Wtf.fly(t).hasClass('x-grid3-hd-btn')){
            e.stopEvent();
            var hd = this.findHeaderCell(t);
            Wtf.fly(hd).addClass('x-grid3-hd-menu-open');
            var index = this.getCellIndex(hd);
            this.hdCtxIndex = index;
            var ms = this.hmenu.items, cm = this.cm;
            ms.get("asc").setDisabled(!cm.isSortable(index));
            ms.get("desc").setDisabled(!cm.isSortable(index));
            this.hmenu.on("hide", function(){
                Wtf.fly(hd).removeClass('x-grid3-hd-menu-open');
            }, this, {single:true});
            this.hmenu.show(t, "tl-bl?");
        }
    },

        handleHdOver : function(e, t){
        var hd = this.findHeaderCell(t);
        if(hd && !this.headersDisabled){
            this.activeHd = hd;
            this.activeHdIndex = this.getCellIndex(hd);
            var fly = this.fly(hd);
            this.activeHdRegion = fly.getRegion();
            if(this.cm.isSortable(this.activeHdIndex) && !this.cm.isFixed(this.activeHdIndex)){
                fly.addClass("x-grid3-hd-over");
                this.activeHdBtn = fly.child('.x-grid3-hd-btn');
                if(this.activeHdBtn){
                    this.activeHdBtn.dom.style.height = (hd.firstChild.offsetHeight-1)+'px';
                }
            }
        }
    },

        handleHdMove : function(e, t){
        if(this.activeHd && !this.headersDisabled){
            var hw = this.splitHandleWidth || 5;
            var r = this.activeHdRegion;
            var x = e.getPageX();
            var ss = this.activeHd.style;
            if(x - r.left <= hw && this.cm.isResizable(this.activeHdIndex-1)){
                if(Wtf.isSafari){
                    ss.cursor = 'e-resize';                }else{
                    ss.cursor = 'col-resize';
                }
            }else if(r.right - x <= (!this.activeHdBtn ? hw : 2) && this.cm.isResizable(this.activeHdIndex)){
                if(Wtf.isSafari){
                    ss.cursor = 'w-resize';                 }else{
                    ss.cursor = 'col-resize';
                }
            }else{
                ss.cursor = '';
            }
        }
    },

        handleHdOut : function(e, t){
        var hd = this.findHeaderCell(t);
        if(hd && (!Wtf.isIE || !e.within(hd, true))){
            this.activeHd = null;
            this.fly(hd).removeClass("x-grid3-hd-over");
            hd.style.cursor = '';
        }
    },

        hasRows : function(){
        var fc = this.mainBody.dom.firstChild;
        return fc && fc.className != 'x-grid-empty';
    },

        bind : function(d, c){
        this.initData(d, c);
    }
});


Wtf.grid.GridView.SplitDragZone = function(grid, hd){
    this.grid = grid;
    this.view = grid.getView();
    this.marker = this.view.resizeMarker;
    this.proxy = this.view.resizeProxy;
    Wtf.grid.GridView.SplitDragZone.superclass.constructor.call(this, hd,
        "gridSplitters" + this.grid.getGridEl().id, {
        dragElId : Wtf.id(this.proxy.dom), resizeFrame:false
    });
    this.scroll = false;
    this.hw = this.view.splitHandleWidth || 5;
};
Wtf.extend(Wtf.grid.GridView.SplitDragZone, Wtf.dd.DDProxy, {

    b4StartDrag : function(x, y){
        this.view.headersDisabled = true;
        var h = this.view.mainWrap.getHeight();
        this.marker.setHeight(h);
        this.marker.show();
        this.marker.alignTo(this.view.getHeaderCell(this.cellIndex), 'tl-tl', [-2, 0]);
        this.proxy.setHeight(h);
        var w = this.cm.getColumnWidth(this.cellIndex);
        var minw = Math.max(w-this.grid.minColumnWidth, 0);
        this.resetConstraints();
        this.setXConstraint(minw, 1000);
        this.setYConstraint(0, 0);
        this.minX = x - minw;
        this.maxX = x + 1000;
        this.startPos = x;
        Wtf.dd.DDProxy.prototype.b4StartDrag.call(this, x, y);
    },


    handleMouseDown : function(e){
        var t = this.view.findHeaderCell(e.getTarget());
        if(t){
            var xy = this.view.fly(t).getXY(), x = xy[0], y = xy[1];
            var exy = e.getXY(), ex = exy[0], ey = exy[1];
            var w = t.offsetWidth, adjust = false;
            if((ex - x) <= this.hw){
                adjust = -1;
            }else if((x+w) - ex <= this.hw){
                adjust = 0;
            }
            if(adjust !== false){
                this.cm = this.grid.colModel;
                var ci = this.view.getCellIndex(t);
                if(adjust == -1){
                    while(this.cm.isHidden(ci+adjust)){
                        --adjust;
                        if(ci+adjust < 0){
                            return;
                        }
                    }
                }
                this.cellIndex = ci+adjust;
                this.split = t.dom;
                if(this.cm.isResizable(this.cellIndex) && !this.cm.isFixed(this.cellIndex)){
                    Wtf.grid.GridView.SplitDragZone.superclass.handleMouseDown.apply(this, arguments);
                }
            }else if(this.view.columnDrag){
                this.view.columnDrag.callHandleMouseDown(e);
            }
        }
    },

    endDrag : function(e){
        this.marker.hide();
        var v = this.view;
        var endX = Math.max(this.minX, e.getPageX());
        var diff = endX - this.startPos;
        v.onColumnSplitterMoved(this.cellIndex, this.cm.getColumnWidth(this.cellIndex)+diff);
        setTimeout(function(){
            v.headersDisabled = false;
        }, 50);
    },

    autoOffset : function(){
        this.setDelta(0,0);
    }
});


Wtf.grid.GroupingView = Wtf.extend(Wtf.grid.GridView, {
    
    hideGroupedColumn:false,
    
    showGroupName:true,
    
    startCollapsed:false,
    
    enableGrouping:true,
    
    enableGroupingMenu:true,
    
    enableNoGroups:true,
    
    emptyGroupText : '(None)',
    
    ignoreAdd: false,
    
    groupTextTpl : '{text}',

    
    gidSeed : 1000,

    
    initTemplates : function(){
        Wtf.grid.GroupingView.superclass.initTemplates.call(this);
        this.state = {};

        var sm = this.grid.getSelectionModel();
        sm.on(sm.selectRow ? 'beforerowselect' : 'beforecellselect',
                this.onBeforeRowSelect, this);

        if(!this.startGroup){
            this.startGroup = new Wtf.XTemplate(
                '<div id="{groupId}" class="x-grid-group {cls}">',
                    '<div id="{groupId}-hd" class="x-grid-group-hd" style="{style}"><div>', this.groupTextTpl ,'</div></div>',
                    '<div id="{groupId}-bd" class="x-grid-group-body">'
            );
        }
        this.startGroup.compile();
        this.endGroup = '</div></div>';
    },

    
    findGroup : function(el){
        return Wtf.fly(el).up('.x-grid-group', this.mainBody.dom);
    },

    
    getGroups : function(){
        return this.hasRows() ? this.mainBody.dom.childNodes : [];
    },

    
    onAdd : function(){
        if(this.enableGrouping && !this.ignoreAdd){
            var ss = this.getScrollState();
            this.refresh();
            this.restoreScroll(ss);
        }else if(!this.enableGrouping){
            Wtf.grid.GroupingView.superclass.onAdd.apply(this, arguments);
        }
    },

    
    onRemove : function(ds, record, index, isUpdate){
        Wtf.grid.GroupingView.superclass.onRemove.apply(this, arguments);
        var g = document.getElementById(record._groupId);
        if(g && g.childNodes[1].childNodes.length < 1){
            Wtf.removeNode(g);
        }
        this.applyEmptyText();
    },

    
    refreshRow : function(record){
        if(this.ds.getCount()==1){
            this.refresh();
        }else{
            this.isUpdating = true;
            Wtf.grid.GroupingView.superclass.refreshRow.apply(this, arguments);
            this.isUpdating = false;
        }
    },

    
    beforeMenuShow : function(){
        var field = this.getGroupField();
        var g = this.hmenu.items.get('groupBy');
        if(g){
            g.setDisabled(this.cm.config[this.hdCtxIndex].groupable === false);
        }
        var s = this.hmenu.items.get('showGroups');
        if(s){
            s.setChecked(!!field);
        }
    },

    
    renderUI : function(){
        Wtf.grid.GroupingView.superclass.renderUI.call(this);
        this.mainBody.on('mousedown', this.interceptMouse, this);

        if(this.enableGroupingMenu && this.hmenu){
            this.hmenu.add('-',{
                id:'groupBy',
                text: this.groupByText,
                handler: this.onGroupByClick,
                scope: this,
                iconCls:'x-group-by-icon'
            });
            if(this.enableNoGroups){
                this.hmenu.add({
                    id:'showGroups',
                    text: this.showGroupsText,
                    checked: true,
                    checkHandler: this.onShowGroupsClick,
                    scope: this
                });
            }
            this.hmenu.on('beforeshow', this.beforeMenuShow, this);
        }
    },

    
    onGroupByClick : function(){
        this.grid.store.groupBy(this.cm.getDataIndex(this.hdCtxIndex));
    },

    
    onShowGroupsClick : function(mi, checked){
        if(checked){
            this.onGroupByClick();
        }else{
            this.grid.store.clearGrouping();
        }
    },

    
    toggleGroup : function(group, expanded){
        this.grid.stopEditing();
        group = Wtf.getDom(group);
        var gel = Wtf.fly(group);
        expanded = expanded !== undefined ?
                expanded : gel.hasClass('x-grid-group-collapsed');

        this.state[gel.dom.id] = expanded;
        gel[expanded ? 'removeClass' : 'addClass']('x-grid-group-collapsed');
    },

    
    toggleAllGroups : function(expanded){
        var groups = this.getGroups();
        for(var i = 0, len = groups.length; i < len; i++){
            this.toggleGroup(groups[i], expanded);
        }
    },

    
    expandAllGroups : function(){
        this.toggleAllGroups(true);
    },

    
    collapseAllGroups : function(){
        this.toggleAllGroups(false);
    },

    
    interceptMouse : function(e){
        var hd = e.getTarget('.x-grid-group-hd', this.mainBody);
        if(hd){
            e.stopEvent();
            this.toggleGroup(hd.parentNode);
        }
    },

    
    getGroup : function(v, r, groupRenderer, rowIndex, colIndex, ds){
        var g = groupRenderer ? groupRenderer(v, {}, r, rowIndex, colIndex, ds) : String(v);
        if(g === ''){
            g = this.cm.config[colIndex].emptyGroupText || this.emptyGroupText;
        }
        return g;
    },

    
    getGroupField : function(){
        return this.grid.store.getGroupState();
    },

    
    renderRows : function(){
        var groupField = this.getGroupField();
        var eg = !!groupField;
        
        if(this.hideGroupedColumn) {
            var colIndex = this.cm.findColumnIndex(groupField);
            if(!eg && this.lastGroupField !== undefined) {
                this.mainBody.update('');
                this.cm.setHidden(this.cm.findColumnIndex(this.lastGroupField), false);
                delete this.lastGroupField;
            }else if (eg && this.lastGroupField === undefined) {
                this.lastGroupField = groupField;
                this.cm.setHidden(colIndex, true);
            }else if (eg && this.lastGroupField !== undefined && groupField !== this.lastGroupField) {
                this.mainBody.update('');
                var oldIndex = this.cm.findColumnIndex(this.lastGroupField);
                this.cm.setHidden(oldIndex, false);
                this.lastGroupField = groupField;
                this.cm.setHidden(colIndex, true);
            }
        }
        return Wtf.grid.GroupingView.superclass.renderRows.apply(
                    this, arguments);
    },

    
    doRender : function(cs, rs, ds, startRow, colCount, stripe){
        if(rs.length < 1){
            return '';
        }
        var groupField = this.getGroupField();
        var colIndex = this.cm.findColumnIndex(groupField);

        this.enableGrouping = !!groupField;

        if(!this.enableGrouping || this.isUpdating){
            return Wtf.grid.GroupingView.superclass.doRender.apply(
                    this, arguments);
        }
        var gstyle = 'width:'+this.getTotalWidth()+';';

        var gidPrefix = this.grid.getGridEl().id;
        var cfg = this.cm.config[colIndex];
        var groupRenderer = cfg.groupRenderer || cfg.renderer;
        var cls = this.startCollapsed ? 'x-grid-group-collapsed' : '';
        var prefix = this.showGroupName ?
                     (cfg.groupName || cfg.header)+': ' : '';

        var groups = [], curGroup, i, len, gid;
        for(i = 0, len = rs.length; i < len; i++){
            var rowIndex = startRow + i;
            var r = rs[i],
                gvalue = r.data[groupField],
                g = this.getGroup(gvalue, r, groupRenderer, rowIndex, colIndex, ds);
            if(!curGroup || curGroup.group != g){
                gid = gidPrefix + '-gp-' + groupField + '-' + g;
                var gcls = cls ? cls : (this.state[gid] === false ? 'x-grid-group-collapsed' : '');
                curGroup = {
                    group: g,
                    gvalue: gvalue,
                    text: prefix + g,
                    groupId: gid,
                    startRow: rowIndex,
                    rs: [r],
                    cls: gcls,
                    style: gstyle
                };
                groups.push(curGroup);
            }else{
                curGroup.rs.push(r);
            }
            r._groupId = gid;
        }

        var buf = [];
        for(i = 0, len = groups.length; i < len; i++){
            var g = groups[i];
            this.doGroupStart(buf, g, cs, ds, colCount);
            buf[buf.length] = Wtf.grid.GroupingView.superclass.doRender.call(
                    this, cs, g.rs, ds, g.startRow, colCount, stripe);

            this.doGroupEnd(buf, g, cs, ds, colCount);
        }
        return buf.join('');
    },

    
    getGroupId : function(value){
        var gidPrefix = this.grid.getGridEl().id;
        var groupField = this.getGroupField();
        var colIndex = this.cm.findColumnIndex(groupField);
        var cfg = this.cm.config[colIndex];
        var groupRenderer = cfg.groupRenderer || cfg.renderer;
        var gtext = this.getGroup(value, {data:{}}, groupRenderer, 0, colIndex, this.ds);
        return gidPrefix + '-gp-' + groupField + '-' + value;
    },

    
    doGroupStart : function(buf, g, cs, ds, colCount){
        buf[buf.length] = this.startGroup.apply(g);
    },

    
    doGroupEnd : function(buf, g, cs, ds, colCount){
        buf[buf.length] = this.endGroup;
    },

    
    getRows : function(){
        if(!this.enableGrouping){
            return Wtf.grid.GroupingView.superclass.getRows.call(this);
        }
        var r = [];
        var g, gs = this.getGroups();
        for(var i = 0, len = gs.length; i < len; i++){
            g = gs[i].childNodes[1].childNodes;
            for(var j = 0, jlen = g.length; j < jlen; j++){
                r[r.length] = g[j];
            }
        }
        return r;
    },

    
    updateGroupWidths : function(){
        if(!this.enableGrouping || !this.hasRows()){
            return;
        }
        var tw = Math.max(this.cm.getTotalWidth(), this.el.dom.offsetWidth-this.scrollOffset) +'px';
        var gs = this.getGroups();
        for(var i = 0, len = gs.length; i < len; i++){
            gs[i].firstChild.style.width = tw;
        }
    },

    
    onColumnWidthUpdated : function(col, w, tw){
        this.updateGroupWidths();
    },

    
    onAllColumnWidthsUpdated : function(ws, tw){
        this.updateGroupWidths();
    },

    
    onColumnHiddenUpdated : function(col, hidden, tw){
        this.updateGroupWidths();
    },

    
    onLayout : function(){
        this.updateGroupWidths();
    },

    
    onBeforeRowSelect : function(sm, rowIndex){
        if(!this.enableGrouping){
            return;
        }
        var row = this.getRow(rowIndex);
        if(row && !row.offsetParent){
            var g = this.findGroup(row);
            this.toggleGroup(g, true);
        }
    },

    
    groupByText: 'Group By This Field',
    
    showGroupsText: 'Show in Groups'
});

Wtf.grid.GroupingView.GROUP_ID = 1000;


Wtf.grid.HeaderDragZone = function(grid, hd, hd2){
    this.grid = grid;
    this.view = grid.getView();
    this.ddGroup = "gridHeader" + this.grid.getGridEl().id;
    Wtf.grid.HeaderDragZone.superclass.constructor.call(this, hd);
    if(hd2){
        this.setHandleElId(Wtf.id(hd));
        this.setOuterHandleElId(Wtf.id(hd2));
    }
    this.scroll = false;
};
Wtf.extend(Wtf.grid.HeaderDragZone, Wtf.dd.DragZone, {
    maxDragWidth: 120,
    getDragData : function(e){
        var t = Wtf.lib.Event.getTarget(e);
        var h = this.view.findHeaderCell(t);
        if(h){
            return {ddel: h.firstChild, header:h};
        }
        return false;
    },

    onInitDrag : function(e){
        this.view.headersDisabled = true;
        var clone = this.dragData.ddel.cloneNode(true);
        clone.id = Wtf.id();
        clone.style.width = Math.min(this.dragData.header.offsetWidth,this.maxDragWidth) + "px";
        this.proxy.update(clone);
        return true;
    },

    afterValidDrop : function(){
        var v = this.view;
        setTimeout(function(){
            v.headersDisabled = false;
        }, 50);
    },

    afterInvalidDrop : function(){
        var v = this.view;
        setTimeout(function(){
            v.headersDisabled = false;
        }, 50);
    }
});



Wtf.grid.HeaderDropZone = function(grid, hd, hd2){
    this.grid = grid;
    this.view = grid.getView();
    
    this.proxyTop = Wtf.DomHelper.append(document.body, {
        cls:"col-move-top", html:"&#160;"
    }, true);
    this.proxyBottom = Wtf.DomHelper.append(document.body, {
        cls:"col-move-bottom", html:"&#160;"
    }, true);
    this.proxyTop.hide = this.proxyBottom.hide = function(){
        this.setLeftTop(-100,-100);
        this.setStyle("visibility", "hidden");
    };
    this.ddGroup = "gridHeader" + this.grid.getGridEl().id;
    
    
    Wtf.grid.HeaderDropZone.superclass.constructor.call(this, grid.getGridEl().dom);
};
Wtf.extend(Wtf.grid.HeaderDropZone, Wtf.dd.DropZone, {
    proxyOffsets : [-4, -9],
    fly: Wtf.Element.fly,

    getTargetFromEvent : function(e){
        var t = Wtf.lib.Event.getTarget(e);
        var cindex = this.view.findCellIndex(t);
        if(cindex !== false){
            return this.view.getHeaderCell(cindex);
        }
    },

    nextVisible : function(h){
        var v = this.view, cm = this.grid.colModel;
        h = h.nextSibling;
        while(h){
            if(!cm.isHidden(v.getCellIndex(h))){
                return h;
            }
            h = h.nextSibling;
        }
        return null;
    },

    prevVisible : function(h){
        var v = this.view, cm = this.grid.colModel;
        h = h.prevSibling;
        while(h){
            if(!cm.isHidden(v.getCellIndex(h))){
                return h;
            }
            h = h.prevSibling;
        }
        return null;
    },

    positionIndicator : function(h, n, e){
        var x = Wtf.lib.Event.getPageX(e);
        var r = Wtf.lib.Dom.getRegion(n.firstChild);
        var px, pt, py = r.top + this.proxyOffsets[1];
        if((r.right - x) <= (r.right-r.left)/2){
            px = r.right+this.view.borderWidth;
            pt = "after";
        }else{
            px = r.left;
            pt = "before";
        }
        var oldIndex = this.view.getCellIndex(h);
        var newIndex = this.view.getCellIndex(n);

        if(this.grid.colModel.isFixed(newIndex)){
            return false;
        }

        var locked = this.grid.colModel.isLocked(newIndex);

        if(pt == "after"){
            newIndex++;
        }
        if(oldIndex < newIndex){
            newIndex--;
        }
        if(oldIndex == newIndex && (locked == this.grid.colModel.isLocked(oldIndex))){
            return false;
        }
        px +=  this.proxyOffsets[0];
        this.proxyTop.setLeftTop(px, py);
        this.proxyTop.show();
        if(!this.bottomOffset){
            this.bottomOffset = this.view.mainHd.getHeight();
        }
        this.proxyBottom.setLeftTop(px, py+this.proxyTop.dom.offsetHeight+this.bottomOffset);
        this.proxyBottom.show();
        return pt;
    },

    onNodeEnter : function(n, dd, e, data){
        if(data.header != n){
            this.positionIndicator(data.header, n, e);
        }
    },

    onNodeOver : function(n, dd, e, data){
        var result = false;
        if(data.header != n){
            result = this.positionIndicator(data.header, n, e);
        }
        if(!result){
            this.proxyTop.hide();
            this.proxyBottom.hide();
        }
        return result ? this.dropAllowed : this.dropNotAllowed;
    },

    onNodeOut : function(n, dd, e, data){
        this.proxyTop.hide();
        this.proxyBottom.hide();
    },

    onNodeDrop : function(n, dd, e, data){
        var h = data.header;
        if(h != n){
            var cm = this.grid.colModel;
            var x = Wtf.lib.Event.getPageX(e);
            var r = Wtf.lib.Dom.getRegion(n.firstChild);
            var pt = (r.right - x) <= ((r.right-r.left)/2) ? "after" : "before";
            var oldIndex = this.view.getCellIndex(h);
            var newIndex = this.view.getCellIndex(n);
            var locked = cm.isLocked(newIndex);
            if(pt == "after"){
                newIndex++;
            }
            if(oldIndex < newIndex){
                newIndex--;
            }
            if(oldIndex == newIndex && (locked == cm.isLocked(oldIndex))){
                return false;
            }
            cm.setLocked(oldIndex, locked, true);
            cm.moveColumn(oldIndex, newIndex);
            this.grid.fireEvent("columnmove", oldIndex, newIndex);
            return true;
        }
        return false;
    }
});


Wtf.grid.GridView.ColumnDragZone = function(grid, hd){
    Wtf.grid.GridView.ColumnDragZone.superclass.constructor.call(this, grid, hd, null);
    this.proxy.el.addClass('x-grid3-col-dd');
};

Wtf.extend(Wtf.grid.GridView.ColumnDragZone, Wtf.grid.HeaderDragZone, {
    handleMouseDown : function(e){

    },

    callHandleMouseDown : function(e){
        Wtf.grid.GridView.ColumnDragZone.superclass.handleMouseDown.call(this, e);
    }
});
Wtf.grid.SplitDragZone = function(grid, hd, hd2){
    this.grid = grid;
    this.view = grid.getView();
    this.proxy = this.view.resizeProxy;
    Wtf.grid.SplitDragZone.superclass.constructor.call(this, hd,
        "gridSplitters" + this.grid.getGridEl().id, {
        dragElId : Wtf.id(this.proxy.dom), resizeFrame:false
    });
    this.setHandleElId(Wtf.id(hd));
    this.setOuterHandleElId(Wtf.id(hd2));
    this.scroll = false;
};
Wtf.extend(Wtf.grid.SplitDragZone, Wtf.dd.DDProxy, {
    fly: Wtf.Element.fly,

    b4StartDrag : function(x, y){
        this.view.headersDisabled = true;
        this.proxy.setHeight(this.view.mainWrap.getHeight());
        var w = this.cm.getColumnWidth(this.cellIndex);
        var minw = Math.max(w-this.grid.minColumnWidth, 0);
        this.resetConstraints();
        this.setXConstraint(minw, 1000);
        this.setYConstraint(0, 0);
        this.minX = x - minw;
        this.maxX = x + 1000;
        this.startPos = x;
        Wtf.dd.DDProxy.prototype.b4StartDrag.call(this, x, y);
    },


    handleMouseDown : function(e){
        ev = Wtf.EventObject.setEvent(e);
        var t = this.fly(ev.getTarget());
        if(t.hasClass("x-grid-split")){
            this.cellIndex = this.view.getCellIndex(t.dom);
            this.split = t.dom;
            this.cm = this.grid.colModel;
            if(this.cm.isResizable(this.cellIndex) && !this.cm.isFixed(this.cellIndex)){
                Wtf.grid.SplitDragZone.superclass.handleMouseDown.apply(this, arguments);
            }
        }
    },

    endDrag : function(e){
        this.view.headersDisabled = false;
        var endX = Math.max(this.minX, Wtf.lib.Event.getPageX(e));
        var diff = endX - this.startPos;
        this.view.onColumnSplitterMoved(this.cellIndex, this.cm.getColumnWidth(this.cellIndex)+diff);
    },

    autoOffset : function(){
        this.setDelta(0,0);
    }
});
Wtf.grid.GridDragZone = function(grid, config){
    this.view = grid.getView();
    Wtf.grid.GridDragZone.superclass.constructor.call(this, this.view.mainBody.dom, config);
    if(this.view.lockedBody){
        this.setHandleElId(Wtf.id(this.view.mainBody.dom));
        this.setOuterHandleElId(Wtf.id(this.view.lockedBody.dom));
    }
    this.scroll = false;
    this.grid = grid;
    this.ddel = document.createElement('div');
    this.ddel.className = 'x-grid-dd-wrap';
};

Wtf.extend(Wtf.grid.GridDragZone, Wtf.dd.DragZone, {
    ddGroup : "GridDD",

    getDragData : function(e){
        var t = Wtf.lib.Event.getTarget(e);
        var rowIndex = this.view.findRowIndex(t);
        if(rowIndex !== false){
            var sm = this.grid.selModel;
            if(!sm.isSelected(rowIndex) || e.hasModifier()){
                sm.handleMouseDown(this.grid, rowIndex, e);
            }
            return {grid: this.grid, ddel: this.ddel, rowIndex: rowIndex, selections:sm.getSelections()};
        }
        return false;
    },

    onInitDrag : function(e){
        var data = this.dragData;
        this.ddel.innerHTML = this.grid.getDragDropText();
        this.proxy.update(this.ddel);
            },

    afterRepair : function(){
        this.dragging = false;
    },

    getRepairXY : function(e, data){
        return false;
    },

    onEndDrag : function(data, e){
            },

    onValidDrop : function(dd, e, id){
                this.hideProxy();
    },

    beforeInvalidDrop : function(e, id){

    }
});


Wtf.grid.ColumnModel = function(config){
	
     this.setConfig(config, true);
    
    this.defaultWidth = 100;

    
    this.defaultSortable = false;

    this.addEvents(
        
	    "widthchange",
        
	    "headerchange",
        
	    "hiddenchange",
	    
        "columnmoved",
        
        "columnlockchange",
        
        "configchange"
    );
    Wtf.grid.ColumnModel.superclass.constructor.call(this);
};
Wtf.extend(Wtf.grid.ColumnModel, Wtf.util.Observable, {
    
    
    
    
    
    
    
    
    
    
    
    

    
    getColumnId : function(index){
        return this.config[index].id;
    },

    
    setConfig : function(config, initial){
        if(!initial){ 
            delete this.totalWidth;
            for(var i = 0, len = this.config.length; i < len; i++){
                var c = this.config[i];
                if(c.editor){
                    c.editor.destroy();
                }
            }
        }
        this.config = config;
        this.lookup = {};
        
        for(var i = 0, len = config.length; i < len; i++){
            var c = config[i];
            if(typeof c.renderer == "string"){
                c.renderer = Wtf.util.Format[c.renderer];
            }
            if(typeof c.id == "undefined"){
                c.id = i;
            }
            if(c.editor && c.editor.isFormField){
                c.editor = new Wtf.grid.GridEditor(c.editor);
            }
            this.lookup[c.id] = c;
        }
        if(!initial){
            this.fireEvent('configchange', this);
        }
    },

    
    getColumnById : function(id){
        return this.lookup[id];
    },

    
    getIndexById : function(id){
        for(var i = 0, len = this.config.length; i < len; i++){
            if(this.config[i].id == id){
                return i;
            }
        }
        return -1;
    },

    
    moveColumn : function(oldIndex, newIndex){
        var c = this.config[oldIndex];
        this.config.splice(oldIndex, 1);
        this.config.splice(newIndex, 0, c);
        this.dataMap = null;
        this.fireEvent("columnmoved", this, oldIndex, newIndex);
    },

    
    isLocked : function(colIndex){
        return this.config[colIndex].locked === true;
    },

    
    setLocked : function(colIndex, value, suppressEvent){
        if(this.isLocked(colIndex) == value){
            return;
        }
        this.config[colIndex].locked = value;
        if(!suppressEvent){
            this.fireEvent("columnlockchange", this, colIndex, value);
        }
    },

    
    getTotalLockedWidth : function(){
        var totalWidth = 0;
        for(var i = 0; i < this.config.length; i++){
            if(this.isLocked(i) && !this.isHidden(i)){
                this.totalWidth += this.getColumnWidth(i);
            }
        }
        return totalWidth;
    },

    
    getLockedCount : function(){
        for(var i = 0, len = this.config.length; i < len; i++){
            if(!this.isLocked(i)){
                return i;
            }
        }
    },

    
    getColumnCount : function(visibleOnly){
        if(visibleOnly === true){
            var c = 0;
            for(var i = 0, len = this.config.length; i < len; i++){
                if(!this.isHidden(i)){
                    c++;
                }
            }
            return c;
        }
        return this.config.length;
    },

    
    getColumnsBy : function(fn, scope){
        var r = [];
        for(var i = 0, len = this.config.length; i < len; i++){
            var c = this.config[i];
            if(fn.call(scope||this, c, i) === true){
                r[r.length] = c;
            }
        }
        return r;
    },

    
    isSortable : function(col){
        if(typeof this.config[col].sortable == "undefined"){
            return this.defaultSortable;
        }
        return this.config[col].sortable;
    },

    
    getRenderer : function(col){
        if(!this.config[col].renderer){
            return Wtf.grid.ColumnModel.defaultRenderer;
        }
        return this.config[col].renderer;
    },

    
    setRenderer : function(col, fn){
        this.config[col].renderer = fn;
    },

    
    getColumnWidth : function(col){
        return this.config[col].width || this.defaultWidth;
    },

    
    setColumnWidth : function(col, width, suppressEvent){
        this.config[col].width = width;
        this.totalWidth = null;
        if(!suppressEvent){
             this.fireEvent("widthchange", this, col, width);
        }
    },

    
    getTotalWidth : function(includeHidden){
        if(!this.totalWidth){
            this.totalWidth = 0;
            for(var i = 0, len = this.config.length; i < len; i++){
                if(includeHidden || !this.isHidden(i)){
                    this.totalWidth += this.getColumnWidth(i);
                }
            }
        }
        return this.totalWidth;
    },

    
    getColumnHeader : function(col){
        return this.config[col].header;
    },

    
    setColumnHeader : function(col, header){
        this.config[col].header = header;
        this.fireEvent("headerchange", this, col, header);
    },

    
    getColumnTooltip : function(col){
            return this.config[col].tooltip;
    },
    
    setColumnTooltip : function(col, tooltip){
            this.config[col].tooltip = tooltip;
    },

    
    getDataIndex : function(col){
        return this.config[col].dataIndex;
    },

    
    setDataIndex : function(col, dataIndex){
        this.config[col].dataIndex = dataIndex;
    },

    findColumnIndex : function(dataIndex){
        var c = this.config;
        for(var i = 0, len = c.length; i < len; i++){
            if(c[i].dataIndex == dataIndex){
                return i;
            }
        }
        return -1;
    },

    
    isCellEditable : function(colIndex, rowIndex){
        return (this.config[colIndex].editable || (typeof this.config[colIndex].editable == "undefined" && this.config[colIndex].editor)) ? true : false;
    },

    
    getCellEditor : function(colIndex, rowIndex){
        return this.config[colIndex].editor;
    },

    
    setEditable : function(col, editable){
        this.config[col].editable = editable;
    },


    
    isHidden : function(colIndex){
        return this.config[colIndex].hidden;
    },


    
    isFixed : function(colIndex){
        return this.config[colIndex].fixed;
    },

    
    isResizable : function(colIndex){
        return colIndex >= 0 && this.config[colIndex].resizable !== false && this.config[colIndex].fixed !== true;
    },
    
    setHidden : function(colIndex, hidden){
        var c = this.config[colIndex];
        if(c.hidden !== hidden){
            c.hidden = hidden;
            this.totalWidth = null;
            this.fireEvent("hiddenchange", this, colIndex, hidden);
        }
    },

    
    setEditor : function(col, editor){
        this.config[col].editor = editor;
    }
});


Wtf.grid.ColumnModel.defaultRenderer = function(value){
	if(typeof value == "string" && value.length < 1){
	    return "&#160;";
	}
	return value;
};


Wtf.grid.DefaultColumnModel = Wtf.grid.ColumnModel;


Wtf.grid.AbstractSelectionModel = function(){
    this.locked = false;
    Wtf.grid.AbstractSelectionModel.superclass.constructor.call(this);
};

Wtf.extend(Wtf.grid.AbstractSelectionModel, Wtf.util.Observable,  {
    
    init : function(grid){
        this.grid = grid;
        this.initEvents();
    },

    
    lock : function(){
        this.locked = true;
    },

    
    unlock : function(){
        this.locked = false;
    },

    
    isLocked : function(){
        return this.locked;
    }
});

Wtf.grid.RowSelectionModel = function(config){
    Wtf.apply(this, config);
    this.selections = new Wtf.util.MixedCollection(false, function(o){
        return o.id;
    });

    this.last = false;
    this.lastActive = false;

    this.addEvents(
        
	    "selectionchange",
        
	    "beforerowselect",
        
	    "rowselect",
        
	    "rowdeselect"
    );

    Wtf.grid.RowSelectionModel.superclass.constructor.call(this);
};

Wtf.extend(Wtf.grid.RowSelectionModel, Wtf.grid.AbstractSelectionModel,  {
    
    singleSelect : false,

    
    initEvents : function(){

        if(!this.grid.enableDragDrop && !this.grid.enableDrag){
            this.grid.on("rowmousedown", this.handleMouseDown, this);
        }else{ 
            this.grid.on("rowclick", function(grid, rowIndex, e) {
                if(e.button === 0 && !e.shiftKey && !e.ctrlKey) {
                    this.selectRow(rowIndex, false);
                    grid.view.focusRow(rowIndex);
                }
            }, this);
        }

        this.rowNav = new Wtf.KeyNav(this.grid.getGridEl(), {
            "up" : function(e){
                if(!e.shiftKey){
                    this.selectPrevious(e.shiftKey);
                }else if(this.last !== false && this.lastActive !== false){
                    var last = this.last;
                    this.selectRange(this.last,  this.lastActive-1);
                    this.grid.getView().focusRow(this.lastActive);
                    if(last !== false){
                        this.last = last;
                    }
                }else{
                    this.selectFirstRow();
                }
            },
            "down" : function(e){
                if(!e.shiftKey){
                    this.selectNext(e.shiftKey);
                }else if(this.last !== false && this.lastActive !== false){
                    var last = this.last;
                    this.selectRange(this.last,  this.lastActive+1);
                    this.grid.getView().focusRow(this.lastActive);
                    if(last !== false){
                        this.last = last;
                    }
                }else{
                    this.selectFirstRow();
                }
            },
            scope: this
        });

        var view = this.grid.view;
        view.on("refresh", this.onRefresh, this);
        view.on("rowupdated", this.onRowUpdated, this);
        view.on("rowremoved", this.onRemove, this);
    },

    
    onRefresh : function(){
        var ds = this.grid.store, index;
        var s = this.getSelections();
        this.clearSelections(true);
        for(var i = 0, len = s.length; i < len; i++){
            var r = s[i];
            if((index = ds.indexOfId(r.id)) != -1){
                this.selectRow(index, true);
            }
        }
        if(s.length != this.selections.getCount()){
            this.fireEvent("selectionchange", this);
        }
    },

    
    onRemove : function(v, index, r){
        if(this.selections.remove(r) !== false){
            this.fireEvent('selectionchange', this);
        }
    },

    
    onRowUpdated : function(v, index, r){
        if(this.isSelected(r)){
            v.onRowSelect(index);
        }
    },

    
    selectRecords : function(records, keepExisting){
        if(!keepExisting){
            this.clearSelections();
        }
        var ds = this.grid.store;
        for(var i = 0, len = records.length; i < len; i++){
            this.selectRow(ds.indexOf(records[i]), true);
        }
    },

    
    getCount : function(){
        return this.selections.length;
    },

    
    selectFirstRow : function(){
        this.selectRow(0);
    },

    
    selectLastRow : function(keepExisting){
        this.selectRow(this.grid.store.getCount() - 1, keepExisting);
    },

    
    selectNext : function(keepExisting){
        if(this.hasNext()){
            this.selectRow(this.last+1, keepExisting);
            this.grid.getView().focusRow(this.last);
        }
    },

    
    selectPrevious : function(keepExisting){
        if(this.hasPrevious()){
            this.selectRow(this.last-1, keepExisting);
            this.grid.getView().focusRow(this.last);
        }
    },

    
    hasNext : function(){
        return this.last !== false && (this.last+1) < this.grid.store.getCount();
    },

    
    hasPrevious : function(){
        return !!this.last;
    },


    
    getSelections : function(){
        return [].concat(this.selections.items);
    },

    
    getSelected : function(){
        return this.selections.itemAt(0);
    },

    
    each : function(fn, scope){
        var s = this.getSelections();
        for(var i = 0, len = s.length; i < len; i++){
            if(fn.call(scope || this, s[i], i) === false){
                return false;
            }
        }
        return true;
    },

    
    clearSelections : function(fast){
        if(this.locked) return;
        if(fast !== true){
            var ds = this.grid.store;
            var s = this.selections;
            s.each(function(r){
                this.deselectRow(ds.indexOfId(r.id));
            }, this);
            s.clear();
        }else{
            this.selections.clear();
        }
        this.last = false;
    },


    
    selectAll : function(){
        if(this.locked) return;
        this.selections.clear();
        for(var i = 0, len = this.grid.store.getCount(); i < len; i++){
            this.selectRow(i, true);
        }
    },

    
    hasSelection : function(){
        return this.selections.length > 0;
    },

    
    isSelected : function(index){
        var r = typeof index == "number" ? this.grid.store.getAt(index) : index;
        return (r && this.selections.key(r.id) ? true : false);
    },

    
    isIdSelected : function(id){
        return (this.selections.key(id) ? true : false);
    },

    
    handleMouseDown : function(g, rowIndex, e){
        if(e.button !== 0 || this.isLocked()){
            return;
        };
        var view = this.grid.getView();
        if(e.shiftKey && this.last !== false){
            var last = this.last;
            this.selectRange(last, rowIndex, e.ctrlKey);
            this.last = last; 
            view.focusRow(rowIndex);
        }else{
            var isSelected = this.isSelected(rowIndex);
            if(e.ctrlKey && isSelected){
                this.deselectRow(rowIndex);
            }else if(!isSelected || this.getCount() > 1){
                this.selectRow(rowIndex, e.ctrlKey || e.shiftKey);
                view.focusRow(rowIndex);
            }
        }
    },

    
    selectRows : function(rows, keepExisting){
        if(!keepExisting){
            this.clearSelections();
        }
        for(var i = 0, len = rows.length; i < len; i++){
            this.selectRow(rows[i], true);
        }
    },

    
    selectRange : function(startRow, endRow, keepExisting){
        if(this.locked) return;
        if(!keepExisting){
            this.clearSelections();
        }
        if(startRow <= endRow){
            for(var i = startRow; i <= endRow; i++){
                this.selectRow(i, true);
            }
        }else{
            for(var i = startRow; i >= endRow; i--){
                this.selectRow(i, true);
            }
        }
    },

    
    deselectRange : function(startRow, endRow, preventViewNotify){
        if(this.locked) return;
        for(var i = startRow; i <= endRow; i++){
            this.deselectRow(i, preventViewNotify);
        }
    },

    
    selectRow : function(index, keepExisting, preventViewNotify){
        if(this.locked || (index < 0 || index >= this.grid.store.getCount())) return;
        var r = this.grid.store.getAt(index);
        if(r && this.fireEvent("beforerowselect", this, index, keepExisting, r) !== false){
            if(!keepExisting || this.singleSelect){
                this.clearSelections();
            }
            this.selections.add(r);
            this.last = this.lastActive = index;
            if(!preventViewNotify){
                this.grid.getView().onRowSelect(index);
            }
            this.fireEvent("rowselect", this, index, r);
            this.fireEvent("selectionchange", this);
        }
    },

    
    deselectRow : function(index, preventViewNotify){
        if(this.locked) return;
        if(this.last == index){
            this.last = false;
        }
        if(this.lastActive == index){
            this.lastActive = false;
        }
        var r = this.grid.store.getAt(index);
        if(r){
            this.selections.remove(r);
            if(!preventViewNotify){
                this.grid.getView().onRowDeselect(index);
            }
            this.fireEvent("rowdeselect", this, index, r);
            this.fireEvent("selectionchange", this);
        }
    },

    
    restoreLast : function(){
        if(this._last){
            this.last = this._last;
        }
    },

    
    acceptsNav : function(row, col, cm){
        return !cm.isHidden(col) && cm.isCellEditable(col, row);
    },

    
    onEditorKey : function(field, e){
        var k = e.getKey(), newCell, g = this.grid, ed = g.activeEditor;
        if(k == e.TAB){
            e.stopEvent();
            ed.completeEdit();
            if(e.shiftKey){
                newCell = g.walkCells(ed.row, ed.col-1, -1, this.acceptsNav, this);
            }else{
                newCell = g.walkCells(ed.row, ed.col+1, 1, this.acceptsNav, this);
            }
        }else if(k == e.ENTER){
            e.stopEvent();
            ed.completeEdit();
            if(e.shiftKey){
                newCell = g.walkCells(ed.row-1, ed.col, -1, this.acceptsNav, this);
            }else{
                newCell = g.walkCells(ed.row+1, ed.col, 1, this.acceptsNav, this);
            }
        }else if(k == e.ESC){
            ed.cancelEdit();
        }
        if(newCell){
            g.startEditing(newCell[0], newCell[1]);
        }
    }
});

Wtf.grid.CellSelectionModel = function(config){
    Wtf.apply(this, config);

    this.selection = null;

    this.addEvents(
        
	    "beforecellselect",
        
	    "cellselect",
        
	    "selectionchange"
    );

    Wtf.grid.CellSelectionModel.superclass.constructor.call(this);
};

Wtf.extend(Wtf.grid.CellSelectionModel, Wtf.grid.AbstractSelectionModel,  {

    
    initEvents : function(){
        this.grid.on("cellmousedown", this.handleMouseDown, this);
        this.grid.getGridEl().on(Wtf.isIE ? "keydown" : "keypress", this.handleKeyDown, this);
        var view = this.grid.view;
        view.on("refresh", this.onViewChange, this);
        view.on("rowupdated", this.onRowUpdated, this);
        view.on("beforerowremoved", this.clearSelections, this);
        view.on("beforerowsinserted", this.clearSelections, this);
        if(this.grid.isEditor){
            this.grid.on("beforeedit", this.beforeEdit,  this);
        }
    },

	    beforeEdit : function(e){
        this.select(e.row, e.column, false, true, e.record);
    },

	    onRowUpdated : function(v, index, r){
        if(this.selection && this.selection.record == r){
            v.onCellSelect(index, this.selection.cell[1]);
        }
    },

	    onViewChange : function(){
        this.clearSelections(true);
    },

	
    getSelectedCell : function(){
        return this.selection ? this.selection.cell : null;
    },

    
    clearSelections : function(preventNotify){
        var s = this.selection;
        if(s){
            if(preventNotify !== true){
                this.grid.view.onCellDeselect(s.cell[0], s.cell[1]);
            }
            this.selection = null;
            this.fireEvent("selectionchange", this, null);
        }
    },

    
    hasSelection : function(){
        return this.selection ? true : false;
    },

    
    handleMouseDown : function(g, row, cell, e){
        if(e.button !== 0 || this.isLocked()){
            return;
        };
        this.select(row, cell);
    },

    
    select : function(rowIndex, colIndex, preventViewNotify, preventFocus,  r){
        if(this.fireEvent("beforecellselect", this, rowIndex, colIndex) !== false){
            this.clearSelections();
            r = r || this.grid.store.getAt(rowIndex);
            this.selection = {
                record : r,
                cell : [rowIndex, colIndex]
            };
            if(!preventViewNotify){
                var v = this.grid.getView();
                v.onCellSelect(rowIndex, colIndex);
                if(preventFocus !== true){
                    v.focusCell(rowIndex, colIndex);
                }
            }
            this.fireEvent("cellselect", this, rowIndex, colIndex);
            this.fireEvent("selectionchange", this, this.selection);
        }
    },

	    isSelectable : function(rowIndex, colIndex, cm){
        return !cm.isHidden(colIndex);
    },

    
    handleKeyDown : function(e){
        if(!e.isNavKeyPress()){
            return;
        }
        var g = this.grid, s = this.selection;
        if(!s){
            e.stopEvent();
            var cell = g.walkCells(0, 0, 1, this.isSelectable,  this);
            if(cell){
                this.select(cell[0], cell[1]);
            }
            return;
        }
        var sm = this;
        var walk = function(row, col, step){
            return g.walkCells(row, col, step, sm.isSelectable,  sm);
        };
        var k = e.getKey(), r = s.cell[0], c = s.cell[1];
        var newCell;

        switch(k){
             case e.TAB:
                 if(e.shiftKey){
                     newCell = walk(r, c-1, -1);
                 }else{
                     newCell = walk(r, c+1, 1);
                 }
             break;
             case e.DOWN:
                 newCell = walk(r+1, c, 1);
             break;
             case e.UP:
                 newCell = walk(r-1, c, -1);
             break;
             case e.RIGHT:
                 newCell = walk(r, c+1, 1);
             break;
             case e.LEFT:
                 newCell = walk(r, c-1, -1);
             break;
             case e.ENTER:
                 if(g.isEditor && !g.editing){
                    g.startEditing(r, c);
                    e.stopEvent();
                    return;
                }
             break;
        };
        if(newCell){
            this.select(newCell[0], newCell[1]);
            e.stopEvent();
        }
    },

    acceptsNav : function(row, col, cm){
        return !cm.isHidden(col) && cm.isCellEditable(col, row);
    },

    onEditorKey : function(field, e){
        var k = e.getKey(), newCell, g = this.grid, ed = g.activeEditor;
        if(k == e.TAB){
            if(e.shiftKey){
                newCell = g.walkCells(ed.row, ed.col-1, -1, this.acceptsNav, this);
            }else{
                newCell = g.walkCells(ed.row, ed.col+1, 1, this.acceptsNav, this);
            }
            e.stopEvent();
        }else if(k == e.ENTER){
            ed.completeEdit();
            e.stopEvent();
        }else if(k == e.ESC){
        	e.stopEvent();
            ed.cancelEdit();
        }
        if(newCell){
            g.startEditing(newCell[0], newCell[1]);
        }
    }
});

Wtf.grid.EditorGridPanel = Wtf.extend(Wtf.grid.GridPanel, {
    
    clicksToEdit: 2,

    
    isEditor : true,
    
    detectEdit: false,

	
    
    trackMouseOver: false, 
    
    
    initComponent : function(){
        Wtf.grid.EditorGridPanel.superclass.initComponent.call(this);

        if(!this.selModel){
            this.selModel = new Wtf.grid.CellSelectionModel();
        }

        this.activeEditor = null;

	    this.addEvents(
            
            "beforeedit",
            
            "afteredit",
            
            "validateedit"
        );
    },

    
    initEvents : function(){
        Wtf.grid.EditorGridPanel.superclass.initEvents.call(this);
        
        this.on("bodyscroll", this.stopEditing, this);

        if(this.clicksToEdit == 1){
            this.on("cellclick", this.onCellDblClick, this);
        }else {
            if(this.clicksToEdit == 'auto' && this.view.mainBody){
                this.view.mainBody.on("mousedown", this.onAutoEditClick, this);
            }
            this.on("celldblclick", this.onCellDblClick, this);
        }
        this.getGridEl().addClass("xedit-grid");
    },

    
    onCellDblClick : function(g, row, col){
        this.startEditing(row, col);
    },

    
    onAutoEditClick : function(e, t){
        var row = this.view.findRowIndex(t);
        var col = this.view.findCellIndex(t);
        if(row !== false && col !== false){
        if(this.selModel.getSelectedCell){ 
            var sc = this.selModel.getSelectedCell();
            if(sc && sc.cell[0] === row && sc.cell[1] === col){
                this.startEditing(row, col);
            }
        }else{
            if(this.selModel.isSelected(row)){
                this.startEditing(row, col);
            }
        }
        }
    },

    
    onEditComplete : function(ed, value, startValue){
        this.editing = false;
        this.activeEditor = null;
        ed.un("specialkey", this.selModel.onEditorKey, this.selModel);
        if(String(value) !== String(startValue)){
            var r = ed.record;
            var field = this.colModel.getDataIndex(ed.col);
            var e = {
                grid: this,
                record: r,
                field: field,
                originalValue: startValue,
                value: value,
                row: ed.row,
                column: ed.col,
                cancel:false
            };
            if(this.fireEvent("validateedit", e) !== false && !e.cancel){
                r.set(field, e.value);
                delete e.cancel;
                this.fireEvent("afteredit", e);
            }
        }
        this.view.focusCell(ed.row, ed.col);
    },

    
    startEditing : function(row, col){
        this.stopEditing();
        if(this.colModel.isCellEditable(col, row)){
            this.view.ensureVisible(row, col, true);
            var r = this.store.getAt(row);
            var field = this.colModel.getDataIndex(col);
            var e = {
                grid: this,
                record: r,
                field: field,
                value: r.data[field],
                row: row,
                column: col,
                cancel:false
            };
            if(this.fireEvent("beforeedit", e) !== false && !e.cancel){
                this.editing = true;
                var ed = this.colModel.getCellEditor(col, row);
                if(!ed.rendered){
                    ed.render(this.view.getEditorParent(ed));
                }
                (function(){ 
                    ed.row = row;
                    ed.col = col;
                    ed.record = r;
                    ed.on("complete", this.onEditComplete, this, {single: true});
                    ed.on("specialkey", this.selModel.onEditorKey, this.selModel);
                    this.activeEditor = ed;
                    var v = r.data[field];
                    ed.startEdit(this.view.getCell(row, col), v);
                }).defer(50, this);
            }
        }
    },
        
    
    stopEditing : function(){
        if(this.activeEditor){
            this.activeEditor.completeEdit();
        }
        this.activeEditor = null;
    }
});
Wtf.reg('editorgrid', Wtf.grid.EditorGridPanel);
Wtf.grid.GridEditor = function(field, config){
    Wtf.grid.GridEditor.superclass.constructor.call(this, field, config);
    field.monitorTab = false;
};

Wtf.extend(Wtf.grid.GridEditor, Wtf.Editor, {
    alignment: "tl-tl",
    autoSize: "width",
    hideEl : false,
    cls: "x-small-editor x-grid-editor",
    shim:false,
    shadow:false
});

Wtf.grid.PropertyRecord = Wtf.data.Record.create([
    {name:'name',type:'string'}, 'value'
]);


Wtf.grid.PropertyStore = function(grid, source){
    this.grid = grid;
    this.store = new Wtf.data.Store({
        recordType : Wtf.grid.PropertyRecord
    });
    this.store.on('update', this.onUpdate,  this);
    if(source){
        this.setSource(source);
    }
    Wtf.grid.PropertyStore.superclass.constructor.call(this);
};
Wtf.extend(Wtf.grid.PropertyStore, Wtf.util.Observable, {
        setSource : function(o){
        this.source = o;
        this.store.removeAll();
        var data = [];
        for(var k in o){
            if(this.isEditableValue(o[k])){
                data.push(new Wtf.grid.PropertyRecord({name: k, value: o[k]}, k));
            }
        }
        this.store.loadRecords({records: data}, {}, true);
    },

        onUpdate : function(ds, record, type){
        if(type == Wtf.data.Record.EDIT){
            var v = record.data['value'];
            var oldValue = record.modified['value'];
            if(this.grid.fireEvent('beforepropertychange', this.source, record.id, v, oldValue) !== false){
                this.source[record.id] = v;
                record.commit();
                this.grid.fireEvent('propertychange', this.source, record.id, v, oldValue);
            }else{
                record.reject();
            }
        }
    },

        getProperty : function(row){
       return this.store.getAt(row);
    },

        isEditableValue: function(val){
        if(val && val instanceof Date){
            return true;
        }else if(typeof val == 'object' || typeof val == 'function'){
            return false;
        }
        return true;
    },

        setValue : function(prop, value){
        this.source[prop] = value;
        this.store.getById(prop).set('value', value);
    },

        getSource : function(){
        return this.source;
    }
});


Wtf.grid.PropertyColumnModel = function(grid, store){
    this.grid = grid;
    var g = Wtf.grid;
    g.PropertyColumnModel.superclass.constructor.call(this, [
        {header: this.nameText, width:50, sortable: true, dataIndex:'name', id: 'name'},
        {header: this.valueText, width:50, resizable:false, dataIndex: 'value', id: 'value'}
    ]);
    this.store = store;
    this.bselect = Wtf.DomHelper.append(document.body, {
        tag: 'select', cls: 'x-grid-editor x-hide-display', children: [
            {tag: 'option', value: 'true', html: 'true'},
            {tag: 'option', value: 'false', html: 'false'}
        ]
    });
    var f = Wtf.form;

    var bfield = new f.Field({
        el:this.bselect,
        bselect : this.bselect,
        autoShow: true,
        getValue : function(){
            return this.bselect.value == 'true';
        }
    });
    this.editors = {
        'date' : new g.GridEditor(new f.DateField({selectOnFocus:true})),
        'string' : new g.GridEditor(new f.TextField({selectOnFocus:true})),
        'number' : new g.GridEditor(new f.NumberField({selectOnFocus:true, style:'text-align:left;'})),
        'boolean' : new g.GridEditor(bfield)
    };
    this.renderCellDelegate = this.renderCell.createDelegate(this);
    this.renderPropDelegate = this.renderProp.createDelegate(this);
};

Wtf.extend(Wtf.grid.PropertyColumnModel, Wtf.grid.ColumnModel, {
        nameText : 'Name',
    valueText : 'Value',
    dateFormat : 'm/j/Y',

        renderDate : function(dateVal){
        return dateVal.dateFormat(this.dateFormat);
    },

        renderBool : function(bVal){
        return bVal ? 'true' : 'false';
    },

        isCellEditable : function(colIndex, rowIndex){
        return colIndex == 1;
    },

        getRenderer : function(col){
        return col == 1 ?
            this.renderCellDelegate : this.renderPropDelegate;
    },

        renderProp : function(v){
        return this.getPropertyName(v);
    },

        renderCell : function(val){
        var rv = val;
        if(val instanceof Date){
            rv = this.renderDate(val);
        }else if(typeof val == 'boolean'){
            rv = this.renderBool(val);
        }
        return Wtf.util.Format.htmlEncode(rv);
    },

        getPropertyName : function(name){
        var pn = this.grid.propertyNames;
        return pn && pn[name] ? pn[name] : name;
    },

        getCellEditor : function(colIndex, rowIndex){
        var p = this.store.getProperty(rowIndex);
        var n = p.data['name'], val = p.data['value'];
        if(this.grid.customEditors[n]){
            return this.grid.customEditors[n];
        }
        if(val instanceof Date){
            return this.editors['date'];
        }else if(typeof val == 'number'){
            return this.editors['number'];
        }else if(typeof val == 'boolean'){
            return this.editors['boolean'];
        }else{
            return this.editors['string'];
        }
    }
});


Wtf.grid.PropertyGrid = Wtf.extend(Wtf.grid.EditorGridPanel, {
    
    

        enableColLock:false,
    enableColumnMove:false,
    stripeRows:false,
    trackMouseOver: false,
    clicksToEdit:1,
    enableHdMenu : false,
    viewConfig : {
        forceFit:true
    },

        initComponent : function(){
        this.customEditors = this.customEditors || {};
        this.lastEditRow = null;
        var store = new Wtf.grid.PropertyStore(this);
        this.propStore = store;
        var cm = new Wtf.grid.PropertyColumnModel(this, store);
        store.store.sort('name', 'ASC');
        this.addEvents(
            
            'beforepropertychange',
            
            'propertychange'
        );
        this.cm = cm;
        this.ds = store.store;
        Wtf.grid.PropertyGrid.superclass.initComponent.call(this);

        this.selModel.on('beforecellselect', function(sm, rowIndex, colIndex){
            if(colIndex === 0){
                this.startEditing.defer(200, this, [rowIndex, 1]);
                return false;
            }
        }, this);
    },

        onRender : function(){
        Wtf.grid.PropertyGrid.superclass.onRender.apply(this, arguments);

        this.getGridEl().addClass('x-props-grid');
    },

        afterRender: function(){
        Wtf.grid.PropertyGrid.superclass.afterRender.apply(this, arguments);
        if(this.source){
            this.setSource(this.source);
        }
    },

    
    setSource : function(source){
        this.propStore.setSource(source);
    },

    
    getSource : function(){
        return this.propStore.getSource();
    }
});

Wtf.grid.RowNumberer = function(config){
    Wtf.apply(this, config);
    if(this.rowspan){
        this.renderer = this.renderer.createDelegate(this);
    }
};

Wtf.grid.RowNumberer.prototype = {
    
    header: "",
    
    width: 23,
    
    sortable: false,

    
    fixed:true,
    dataIndex: '',
    id: 'numberer',
    rowspan: undefined,

    
    renderer : function(v, p, record, rowIndex){
        if(this.rowspan){
            p.cellAttr = 'rowspan="'+this.rowspan+'"';
        }
        return rowIndex+1;
    }
};

Wtf.grid.CheckboxSelectionModel = Wtf.extend(Wtf.grid.RowSelectionModel, {
    
    header: '<div class="x-grid3-hd-checker">&#160;</div>',
    
    width: 20,
    
    sortable: false,

    
    fixed:true,
    dataIndex: '',
    id: 'checker',

    
    initEvents : function(){
        Wtf.grid.CheckboxSelectionModel.superclass.initEvents.call(this);
        this.grid.on('render', function(){
            var view = this.grid.getView();
            view.mainBody.on('mousedown', this.onMouseDown, this);
            Wtf.fly(view.innerHd).on('mousedown', this.onHdMouseDown, this);

        }, this);
    },

    
    onMouseDown : function(e, t){
        if(t.className == 'x-grid3-row-checker'){
            e.stopEvent();
            var row = e.getTarget('.x-grid3-row');
            if(row){
                var index = row.rowIndex;
                if(this.isSelected(index)){
                    this.deselectRow(index);
                }else{
                    this.selectRow(index, true);
                }
            }
        }
    },

    
    onHdMouseDown : function(e, t){
        if(t.className == 'x-grid3-hd-checker'){
            e.stopEvent();
            var hd = Wtf.fly(t.parentNode);
            var isChecked = hd.hasClass('x-grid3-hd-checker-on');
            if(isChecked){
                hd.removeClass('x-grid3-hd-checker-on');
                this.clearSelections();
            }else{
                hd.addClass('x-grid3-hd-checker-on');
                this.selectAll();
            }
        }
    },

    
    renderer : function(v, p, record){
        return '<div class="x-grid3-row-checker">&#160;</div>';
    }
});

Wtf.LoadMask = function(el, config){
    this.el = Wtf.get(el);
    Wtf.apply(this, config);
    if(this.store){
        this.store.on('beforeload', this.onBeforeLoad, this);
        this.store.on('load', this.onLoad, this);
        this.store.on('loadexception', this.onLoad, this);
        this.removeMask = Wtf.value(this.removeMask, false);
    }else{
        var um = this.el.getUpdater();
        um.showLoadIndicator = false;         um.on('beforeupdate', this.onBeforeLoad, this);
        um.on('update', this.onLoad, this);
        um.on('failure', this.onLoad, this);
        this.removeMask = Wtf.value(this.removeMask, true);
    }
};

Wtf.LoadMask.prototype = {
    
    
    msg : 'Loading...',
    
    msgCls : 'x-mask-loading',

    
    disabled: false,

    
    disable : function(){
       this.disabled = true;
    },

    
    enable : function(){
        this.disabled = false;
    },

        onLoad : function(){
        this.el.unmask(this.removeMask);
    },

        onBeforeLoad : function(){
        if(!this.disabled){
            this.el.mask(this.msg, this.msgCls);
        }
    },

    show: function(){
        this.onBeforeLoad();
    },

    hide: function(){
        this.onLoad();    
    },

        destroy : function(){
        if(this.store){
            this.store.un('beforeload', this.onBeforeLoad, this);
            this.store.un('load', this.onLoad, this);
            this.store.un('loadexception', this.onLoad, this);
        }else{
            var um = this.el.getUpdater();
            um.un('beforeupdate', this.onBeforeLoad, this);
            um.un('update', this.onLoad, this);
            um.un('failure', this.onLoad, this);
        }
    }
};

Wtf.ProgressBar = Wtf.extend(Wtf.BoxComponent, {
   
    baseCls : 'x-progress',

    
    waitTimer : null,

    
    initComponent : function(){
        Wtf.ProgressBar.superclass.initComponent.call(this);
        this.addEvents(
            
            "update"
        );
    },

    
    onRender : function(ct, position){
        Wtf.ProgressBar.superclass.onRender.call(this, ct, position);

        var tpl = new Wtf.Template(
            '<div class="{cls}-wrap">',
                '<div class="{cls}-inner">',
                    '<div class="{cls}-bar">',
                        '<div class="{cls}-text">',
                            '<div>&#160;</div>',
                        '</div>',
                    '</div>',
                    '<div class="{cls}-text {cls}-text-back">',
                        '<div>&#160;</div>',
                    '</div>',
                '</div>',
            '</div>'
        );

        if(position){
            this.el = tpl.insertBefore(position, {cls: this.baseCls}, true);
        }else{
            this.el = tpl.append(ct, {cls: this.baseCls}, true);
        }
        if(this.id){
            this.el.dom.id = this.id;
        }
        var inner = this.el.dom.firstChild;
        this.progressBar = Wtf.get(inner.firstChild);

        if(this.textEl){
            
            this.textEl = Wtf.get(this.textEl);
            delete this.textTopEl;
        }else{
            
            this.textTopEl = Wtf.get(this.progressBar.dom.firstChild);
            var textBackEl = Wtf.get(inner.childNodes[1]);
            this.textTopEl.setStyle("z-index", 99).addClass('x-hidden');
            this.textEl = new Wtf.CompositeElement([this.textTopEl.dom.firstChild, textBackEl.dom.firstChild]);
            this.textEl.setWidth(inner.offsetWidth);
        }
        if(this.value){
            this.updateProgress(this.value, this.text);
        }else{
            this.updateText(this.text);
        }
        this.setSize(this.width || 'auto', 'auto');
        this.progressBar.setHeight(inner.offsetHeight);
    },

    
    updateProgress : function(value, text){
        this.value = value || 0;
        if(text){
            this.updateText(text);
        }
        var w = Math.floor(value*this.el.dom.firstChild.offsetWidth);
        this.progressBar.setWidth(w);
        if(this.textTopEl){
            
            this.textTopEl.removeClass('x-hidden').setWidth(w);
        }
        this.fireEvent('update', this, value, text);
        return this;
    },

    
    wait : function(o){
        if(!this.waitTimer){
            var scope = this;
            o = o || {};
            this.waitTimer = Wtf.TaskMgr.start({
                run: function(i){
                    var inc = o.increment || 10;
                    this.updateProgress(((((i+inc)%inc)+1)*(100/inc))*.01);
                },
                interval: o.interval || 1000,
                duration: o.duration,
                onStop: function(){
                    if(o.fn){
                        o.fn.apply(o.scope || this);
                    }
                    this.reset();
                },
                scope: scope
            });
        }
        return this;
    },

    
    isWaiting : function(){
        return this.waitTimer != null;
    },

    
    updateText : function(text){
        this.text = text || '&#160;';
        this.textEl.update(this.text);
        return this;
    },

    
    setSize : function(w, h){
        Wtf.ProgressBar.superclass.setSize.call(this, w, h);
        if(this.textTopEl){
            var inner = this.el.dom.firstChild;
            this.textEl.setSize(inner.offsetWidth, inner.offsetHeight);
        }
        return this;
    },

    
    reset : function(hide){
        this.updateProgress(0);
        if(this.textTopEl){
            this.textTopEl.addClass('x-hidden');
        }
        if(this.waitTimer){
            this.waitTimer.onStop = null; 
            Wtf.TaskMgr.stop(this.waitTimer);
            this.waitTimer = null;
        }
        if(hide === true){
            this.hide();
        }
        return this;
    }
});
Wtf.reg('progress', Wtf.ProgressBar);
Wtf.debug = {};

(function(){

var cp;

function createConsole(){

    var scriptPanel = new Wtf.debug.ScriptsPanel();
    var logView = new Wtf.debug.LogPanel();
    var tree = new Wtf.debug.DomTree();

    var tabs = new Wtf.TabPanel({
        activeTab: 0,
        border: false,
        tabPosition: 'bottom',
        items: [{
            title: 'Debug Console',
            layout:'border',
            items: [logView, scriptPanel]
        },{
            title: 'DOM Inspector',
            layout:'border',
            items: [tree]
        }]
    });

    cp = new Wtf.Panel({
        id: 'x-debug-browser',
        title: 'Console',
        collapsible: true,
        animCollapse: false,
        style: 'position:absolute;left:0;bottom:0;',
        height:200,
        logView: logView,
        layout: 'fit',
        
        tools:[{
            id: 'close',
            handler: function(){
                cp.destroy();
                cp = null;
                Wtf.EventManager.removeResizeListener(handleResize);
            }
        }],

        items: tabs
    });

    cp.render(document.body);

    cp.resizer = new Wtf.Resizable(cp.el, {
        minHeight:50,
        handles: "n",
        pinned: true,
        transparent:true,
        resizeElement : function(){
            var box = this.proxy.getBox();
            this.proxy.hide();
            cp.setHeight(box.height);
            return box;
        }
    });

    function handleResize(){
        cp.setWidth(Wtf.getBody().getViewSize().width);
    }
    Wtf.EventManager.onWindowResize(handleResize);

    handleResize();
}


Wtf.apply(Wtf, {
    log : function(){
        if(!cp){
            createConsole();
        }
        cp.logView.log.apply(cp.logView, arguments);
    },

    logf : function(format, arg1, arg2, etc){
        Wtf.log(String.format.apply(String, arguments));
    },

    dump : function(o){
        if(typeof o == 'string' || typeof o == 'number' || typeof o == 'undefined' || o instanceof Date){
            Wtf.log(o);
        }else if(!o){
            Wtf.log("null");
        }else if(typeof o != "object"){
            Wtf.log('Unknown return type');
        }else if(o instanceof Array){
            Wtf.log('['+o.join(',')+']');
        }else{
            var b = ["{\n"];
            for(var key in o){
                var to = typeof o[key];
                if(to != "function" && to != "object"){
                    b.push(String.format("  {0}: {1},\n", key, o[key]));
                }
            }
            var s = b.join("");
            if(s.length > 3){
                s = s.substr(0, s.length-2);
            }
            Wtf.log(s + "\n}");
        }
    },

    _timers : {},

    time : function(name){
        name = name || "def";
        Wtf._timers[name] = new Date().getTime();
    },

    timeEnd : function(name, printResults){
        var t = new Date().getTime();
        name = name || "def";
        var v = String.format("{0} ms", t-Wtf._timers[name]);
        Wtf._timers[name] = new Date().getTime();
        if(printResults !== false){
            Wtf.log('Timer ' + (name == "def" ? v : name + ": " + v));
        }
        return v;
    }
});

})();


Wtf.debug.ScriptsPanel = Wtf.extend(Wtf.Panel, {
    id:'x-debug-scripts',
    region: 'east',
    minWidth: 200,
    split: true,
    width: 350,
    border: false,
    layout:'anchor',
    style:'border-width:0 0 0 1px;',

    initComponent : function(){

        this.scriptField = new Wtf.form.TextArea({
            anchor: '100% -26',
            style:'border-width:0;'
        });

        this.trapBox = new Wtf.form.Checkbox({
            id: 'console-trap',
            boxLabel: 'Trap Errors',
            checked: true
        });

        this.toolbar = new Wtf.Toolbar([{
                text: 'Run',
                scope: this,
                handler: this.evalScript
            },{
                text: 'Clear',
                scope: this,
                handler: this.clear
            },
            '->',
            this.trapBox,
            ' ', ' '
        ]);

        this.items = [this.toolbar, this.scriptField];

        Wtf.debug.ScriptsPanel.superclass.initComponent.call(this);
    },

    evalScript : function(){
        var s = this.scriptField.getValue();
        if(this.trapBox.getValue()){
            try{
                var rt = eval(s);
                Wtf.dump(rt === undefined? '(no return)' : rt);
            }catch(e){
                Wtf.log(e.message || e.descript);
            }
        }else{
            var rt = eval(s);
            Wtf.dump(rt === undefined? '(no return)' : rt);
        }
    },

    clear : function(){
        this.scriptField.setValue('');
        this.scriptField.focus();
    }

});

Wtf.debug.LogPanel = Wtf.extend(Wtf.Panel, {
    autoScroll: true,
    region: 'center',
    border: false,
    style:'border-width:0 1px 0 0',

    log : function(){
        var markup = [  '<div style="padding:5px !important;border-bottom:1px solid #ccc;">',
                    Wtf.util.Format.htmlEncode(Array.prototype.join.call(arguments, ', ')).replace(/\n/g, '<br />').replace(/\s/g, '&#160;'),
                    '</div>'].join('');

        this.body.insertHtml('beforeend', markup);
        this.body.scrollTo('top', 100000);
    },

    clear : function(){
        this.body.update('');
        this.body.dom.scrollTop = 0;
    }
});

Wtf.debug.DomTree = Wtf.extend(Wtf.tree.TreePanel, {
    enableDD:false ,
    lines:false,
    rootVisible:false,
    animate:false,
    hlColor:'ffff9c',
    autoScroll: true,
    region:'center',
    border:false,

    initComponent : function(){


        Wtf.debug.DomTree.superclass.initComponent.call(this);
        
                var styles = false, hnode;
        var nonSpace = /^\s*$/;
        var html = Wtf.util.Format.htmlEncode;
        var ellipsis = Wtf.util.Format.ellipsis;
        var styleRe = /\s?([a-z\-]*)\:([^;]*)(?:[;\s\n\r]*)/gi;

        function findNode(n){
            if(!n || n.nodeType != 1 || n == document.body || n == document){
                return false;
            }
            var pn = [n], p = n;
            while((p = p.parentNode) && p.nodeType == 1 && p.tagName.toUpperCase() != 'HTML'){
                pn.unshift(p);
            }
            var cn = hnode;
            for(var i = 0, len = pn.length; i < len; i++){
                cn.expand();
                cn = cn.findChild('htmlNode', pn[i]);
                if(!cn){                     return false;
                }
            }
            cn.select();
            var a = cn.ui.anchor;
            treeEl.dom.scrollTop = Math.max(0 ,a.offsetTop-10);
                        cn.highlight();
            return true;
        }

        function nodeTitle(n){
            var s = n.tagName;
            if(n.id){
                s += '#'+n.id;
            }else if(n.className){
                s += '.'+n.className;
            }
            return s;
        }

        function onNodeSelect(t, n, last){
            return;
            if(last && last.unframe){
                last.unframe();
            }
            var props = {};
            if(n && n.htmlNode){
                if(frameEl.pressed){
                    n.frame();
                }
                if(inspecting){
                    return;
                }
                addStyle.enable();
                reload.setDisabled(n.leaf);
                var dom = n.htmlNode;
                stylePanel.setTitle(nodeTitle(dom));
                if(styles && !showAll.pressed){
                    var s = dom.style ? dom.style.cssText : '';
                    if(s){
                        var m;
                        while ((m = styleRe.exec(s)) != null){
                            props[m[1].toLowerCase()] = m[2];
                        }
                    }
                }else if(styles){
                    var cl = Wtf.debug.cssList;
                    var s = dom.style, fly = Wtf.fly(dom);
                    if(s){
                        for(var i = 0, len = cl.length; i<len; i++){
                            var st = cl[i];
                            var v = s[st] || fly.getStyle(st);
                            if(v != undefined && v !== null && v !== ''){
                                props[st] = v;
                            }
                        }
                    }
                }else{
                    for(var a in dom){
                        var v = dom[a];
                        if((isNaN(a+10)) && v != undefined && v !== null && v !== '' && !(Wtf.isGecko && a[0] == a[0].toUpperCase())){
                            props[a] = v;
                        }
                    }
                }
            }else{
                if(inspecting){
                    return;
                }
                addStyle.disable();
                reload.disabled();
            }
            stylesGrid.setSource(props);
            stylesGrid.treeNode = n;
            stylesGrid.view.fitColumns();
        }

        this.loader = new Wtf.tree.TreeLoader();
        this.loader.load = function(n, cb){
            var isBody = n.htmlNode == document.body;
            var cn = n.htmlNode.childNodes;
            for(var i = 0, c; c = cn[i]; i++){
                if(isBody && c.id == 'x-debug-browser'){
                    continue;
                }
                if(c.nodeType == 1){
                    n.appendChild(new Wtf.debug.HtmlNode(c));
                }else if(c.nodeType == 3 && !nonSpace.test(c.nodeValue)){
                    n.appendChild(new Wtf.tree.TreeNode({
                        text:'<em>' + ellipsis(html(String(c.nodeValue)), 35) + '</em>',
                        cls: 'x-tree-noicon'
                    }));
                }
            }
            cb();
        };

        
        this.root = this.setRootNode(new Wtf.tree.TreeNode('Wtf'));

        hnode = this.root.appendChild(new Wtf.debug.HtmlNode(
                document.getElementsByTagName('html')[0]
        ));

    }
});


Wtf.debug.HtmlNode = function(){
    var html = Wtf.util.Format.htmlEncode;
    var ellipsis = Wtf.util.Format.ellipsis;
    var nonSpace = /^\s*$/;

    var attrs = [
        {n: 'id', v: 'id'},
        {n: 'className', v: 'class'},
        {n: 'name', v: 'name'},
        {n: 'type', v: 'type'},
        {n: 'src', v: 'src'},
        {n: 'href', v: 'href'}
    ];

    function hasChild(n){
        for(var i = 0, c; c = n.childNodes[i]; i++){
            if(c.nodeType == 1){
                return true;
            }
        }
        return false;
    }

    function renderNode(n, leaf){
        var tag = n.tagName.toLowerCase();
        var s = '&lt;' + tag;
        for(var i = 0, len = attrs.length; i < len; i++){
            var a = attrs[i];
            var v = n[a.n];
            if(v && !nonSpace.test(v)){
                s += ' ' + a.v + '=&quot;<i>' + html(v) +'</i>&quot;';
            }
        }
        var style = n.style ? n.style.cssText : '';
        if(style){
            s += ' style=&quot;<i>' + html(style.toLowerCase()) +'</i>&quot;';
        }
        if(leaf && n.childNodes.length > 0){
            s+='&gt;<em>' + ellipsis(html(String(n.innerHTML)), 35) + '</em>&lt;/'+tag+'&gt;';
        }else if(leaf){
            s += ' /&gt;';
        }else{
            s += '&gt;';
        }
        return s;
    }

    var HtmlNode = function(n){
        var leaf = !hasChild(n);
        this.htmlNode = n;
        this.tagName = n.tagName.toLowerCase();
        var attr = {
            text : renderNode(n, leaf),
            leaf : leaf,
            cls: 'x-tree-noicon'
        };
        HtmlNode.superclass.constructor.call(this, attr);
        this.attributes.htmlNode = n;         if(!leaf){
            this.on('expand', this.onExpand,  this);
            this.on('collapse', this.onCollapse,  this);
        }
    };


    Wtf.extend(HtmlNode, Wtf.tree.AsyncTreeNode, {
        cls: 'x-tree-noicon',
        preventHScroll: true,
        refresh : function(highlight){
            var leaf = !hasChild(this.htmlNode);
            this.setText(renderNode(this.htmlNode, leaf));
            if(highlight){
                Wtf.fly(this.ui.textNode).highlight();
            }
        },

        onExpand : function(){
            if(!this.closeNode && this.parentNode){
                this.closeNode = this.parentNode.insertBefore(new Wtf.tree.TreeNode({
                    text:'&lt;/' + this.tagName + '&gt;',
                    cls: 'x-tree-noicon'
                }), this.nextSibling);
            }else if(this.closeNode){
                this.closeNode.ui.show();
            }
        },

        onCollapse : function(){
            if(this.closeNode){
                this.closeNode.ui.hide();
            }
        },

        render : function(bulkRender){
            HtmlNode.superclass.render.call(this, bulkRender);
        },

        highlightNode : function(){
                    },

        highlight : function(){
                    },

        frame : function(){
            this.htmlNode.style.border = '1px solid #0000ff';
                    },

        unframe : function(){
                        this.htmlNode.style.border = '';
        }
    });

    return HtmlNode;
}();



