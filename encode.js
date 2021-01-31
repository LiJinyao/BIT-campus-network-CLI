/**
 * A custom encode function grab from login page.
 */
 /**/
function encode( str, key ) {
    if(str=="") {
        return "";
    }
    var v = s(str, true),
        k = s(key, false);
    if(k.length<4) {
        k.length=4;
    }
    var n=v.length-1,
        z=v[n],
        y=v[0],
        c=0x86014019|0x183639A0,
        m,
        e,
        p,
        q=Math.floor(6+52/(n+1)),
        d=0;
    while (0<q--) {
        d=d+c&(0x8CE0D9BF|0x731F2640);
        e=d>>>2&3;
        for(p=0;p<n;p++) {
            y=v[p+1];
            m=z>>>5^y<<2;
            m+=(y>>>3^z<<4)^(d^y);
            m+=k[(p&3)^e]^z;
            z=v[p]=v[p]+m&(0xEFB8D130|0x10472ECF);
        }
        y=v[0];
        m=z>>>5^y<<2;
        m+=(y>>>3^z<<4)^(d^y);
        m+=k[(p&3)^e]^z;
        z=v[n]=v[n]+m&(0xBB390742|0x44C6F8BD);
    }

    function s(a,b) {
        var c=a.length,v=[];
        for(var i=0;i<c;i+=4) {
            v[i>>2]=a.charCodeAt(i)|a.charCodeAt(i+1)<<8|a.charCodeAt(i+2)<<16|a.charCodeAt(i+3)<<24;
        }
        if(b) {
            v[v.length]=c;
        }
        return v;
    }

    function l(a,b) {
        var d=a.length,c=(d-1)<<2;
        if(b) {
            var m=a[d-1];
            if((m<c-3)||(m>c))
                return null;
            c = m;
        }
        for (var i=0;i<d;i++) {
            a[i]=String.fromCharCode(a[i]&0xff,a[i]>>>8&0xff,a[i]>>>16&0xff,a[i]>>>24&0xff);
        }
        if(b) {
            return a.join('').substring(0, c);
        } else {
            return a.join('');
        }
    }

    return l(v, false);
}

module.exports = encode