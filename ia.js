//*******************************************//
// IA
// 김기현 : kimkee@naver.com
// update : 2022-09-01 ~
//*******************************************//
Element.prototype.appendHtml = function(str){
    var div = document.createElement("div");
    div.innerHTML = str;
    while (div.children.length > 0) {
        // console.log(div.children);
        this.appendChild( div.children[0] );
    }
};
Element.prototype.prependHtml = function(str){
    var div = document.createElement("div");
    div.innerHTML = str;
    while (div.children.length > 0) {
        // console.log(div.children);
        this.prepend( div.children[0] );
    }
};
Element.prototype.is = function(opt){
    // console.log(this);
    if (opt == ":visible") {
        return !!(  this.offsetWidth || this.offsetHeight || this.getClientRects().length );
    }
    if (opt == ":hidden") {
        return !!!( this.offsetWidth || this.offsetHeight || this.getClientRects().length );
    }
    console.log(this , opt);
};
Element.prototype.hasClass = function(cls){
    console.log(this , cls);
    return !!( this.classList.contains(cls) );
};
const ia = {
    init:function(){
        this.stats();
        this.total.init();
        this.total.cate();
        this.user.init();
        this.menu.init();
        this.fixnav.init();
        this.veiwall.init();
        this.mact();
        this.memo.init();
        this.ly.init();
        document.title = "IA-"+ia.plat().toUpperCase();    
    },
    update:function(){
        this.ly.set();
    },
    opts:{
        usrs: [
            "김기현", "홍길동", "김선생", "미지정",
        ],
        stts: [
            "대기", "진행", "검수", "완료", "삭제", "우선",
        ],
        stxt: { /* 상태값 class */
            "대기": "sty", "진행": "ing", "검수": "chk",
            "완료": "com", "삭제": "del", "우선": "wan",
        },
        label: { /* td라벨 */
            numb: "NO", lev2: "Lv.2", lev3: "Lv.3", lev4: "Lv.4", lev5: "Lv.5",
            tits: "화면", code: "ID", urls: "파일", date: "날짜", stat: "상태", name: "담당", memo: "메모",
        },
    },
    data:{
        set:function(name,obj){
            var orgs = JSON.parse( localStorage.getItem(name) ) || {};
            var news = obj;
            // news[key] = val;
            if (typeof obj == "object") {
                // news = $.extend(orgs,news);
                news = Object.assign(orgs,news);
            }
            localStorage.setItem(name, JSON.stringify(news) );
        },
        get:function(name,key){
            // console.log(key);
            var data = JSON.parse( localStorage.getItem(name) );
            if (key != undefined) {
                try {
                    return data[key];
                } catch (e) {
                    return false;
                }
            } else {
                return data;
            }
        },
    },
    plat:function(){
        var path = location.pathname.split("/");
        path = "static";
        return path;
    },
    stats:function(){
        const tbtr = document.querySelectorAll(".ia-body table tbody tr");
        tbtr.forEach( tr => {
            const stat = tr.querySelector("td.stat");
            const name = tr.querySelector("td.name");
            const txt = stat.innerText;
            !txt ? stat.innerText = '대기':null;
            !name.innerText && tr.classList.add("none");
            !name.innerText ? name.innerText = "미지정" : null ;
            tr.classList.add(ia.opts.stxt[txt]||'sty');
            // console.log( txt , !!name.innerText );
            
            const link = tr.querySelector("td.urls a");
            const href = link.getAttribute("href").includes("javascript:;") ? null : link.getAttribute("href").replace("../../html",".");
            link.setAttribute("target","_blank");
            link.innerText =  href;
            link.addEventListener("click", e => {
                e.stopPropagation();
                e.target.closest("tr").classList.add("active");
            });
            tr.addEventListener("click", e => {
                // e.stopPropagation();
                e.target != tr.querySelector("button") ? tr.classList.toggle("active") : null ;
            } );

            /* td에 data-label 넣기 */
            Object.keys(ia.opts.label).forEach( k => tr.querySelector("td."+k).setAttribute("data-label",ia.opts.label[k]) );
        });

        const dtd = document.querySelectorAll(".ia-body .list>dt");
        dtd.forEach( (e,i) => {
            i++;
            e.classList.add("tm"+i);
            e.nextElementSibling.classList.add("dd"+i);
        });
        // console.log( "ia.stats();" );
    },
    ly:{
        init:function(){
            this.evt();
            this.set();
        },
        evt:function(){
            window.addEventListener("load",   e => this.set());
            window.addEventListener("resize", e => this.set());
            window.addEventListener("scroll", e => this.set());
        },
        set:function(){
            const hdHeight = document.querySelector(".ia-head").offsetHeight  || 0;
            const nvHeight = document.querySelector(".ia-body .navs").offsetHeight || 0;
            // console.log(hdHeight , nvHeight);
            document.querySelector(".ia-wrap").style.paddingTop = hdHeight+"rem";
            document.querySelector(".ia-body").style.paddingTop = nvHeight+"rem";
            document.querySelector(".fixnav").style.top = hdHeight+nvHeight+7+"rem";
            document.querySelector(".ia-body .navs").style.top = hdHeight+"rem";
        }
    },
    fixnav:{
        init:function(){
            document.querySelector(".navs").appendHtml(this.els);
            this.evt();
            const theme = ia.data.get("ia","theme"); //
            this.them(theme);
        },
        els:'<nav class="fixnav">'+
                '<button type="button" class="bt viewall">전체보기</button>'+
                '<button type="button" class="bt them">🌚</button>'+
                '<button type="button" class="bt top">▲</button>'+
            '</nav>',
        evt:function(){
            document.querySelector(".fixnav .bt.top").addEventListener("click", e => this.gotop(e.target) );
            document.querySelector(".fixnav .bt.them").addEventListener("click", e => ia.data.get("ia","theme") == "dark" ? this.them("light") : this.them("dark"));
        },
        gotop:function(el){
            window.scrollTo(0, 0);
        },
        them:function(type){
            if (type == false) {
                // window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ?  type = "light" :  type = "dark";
                type = "dark";
            }
            if( type == "dark" ){
                document.querySelector("body").classList.add("is-dark");
                document.querySelector(".fixnav .bt.them").innerText = "🌚";
                document.querySelector('[name="theme-color"]').setAttribute("content","#212121");
            }
            if( type == "light"){
                document.querySelector("body").classList.remove("is-dark");
                document.querySelector(".fixnav .bt.them").innerText = "🌞";
                document.querySelector('[name="theme-color"]').setAttribute("content","#ffffff");
            }
            // console.log(type);
            ia.data.set("ia",{theme:type}); // 
        }
    },
    loading:{ // 로딩중..
        show: function () {

            if( document.querySelector(".ia-loading") ) return;
            
            const els = 
            '<div class="ia-loading">'+
                '<div class="bx">'+
                    '<em><i></i></em>'+
                '</div>'+
            '</div>';
             
            document.querySelector("body").prependHtml(els);
            document.querySelector("body").classList.add("is-loading");
            
        },
        hide: function () {
            const loading = document.querySelector(".ia-loading");
            if (loading) {
                document.querySelector(".ia-loading").remove();
                document.querySelector("body").classList.remove("is-loading");
            }
        }
    },
    total:{
        init:function(){

        },
        set:function(){
            ia.loading.show();
            setTimeout( e => ia.loading.hide(), 200 );
            
            const count = {
                tots:{ tot: 0, sty: 0, ing: 0, chk: 0, com: 0, del: 0, wan: 0, pct: 0 },
                user:{ tot: 0, sty: 0, ing: 0, chk: 0, com: 0, del: 0, wan: 0, pct: 0 }
            };
            document.querySelectorAll(".ia-body table.tbl tbody tr:not(.nodata)").forEach( (tr,idx) => {
                const sxt = tr.querySelector("td.stat");
                const txt = sxt.innerText;
                const ttt = ia.opts.stxt[txt];

                count.tots.tot++;
                count.tots[ttt]++;
                if( tr.is(":visible") ){ 
                    count.user.tot++;
                    count.user[ttt]++;
                }
                
            });
            Object.keys(count.user).forEach( k => document.querySelector(".info.usr ."+k).innerText = count.user[k] );
            Object.keys(count.tots).forEach( k => document.querySelector(".info.tot ."+k).innerText = count.tots[k] );

            count.user.pct = (count.user.com + count.user.chk + count.user.del) / count.user.tot * 100 || 0;
            document.querySelector(".info.usr .pct").innerHTML =  count.user.pct.toFixed(1)+"%" ;
            document.querySelector(".info.usr .graph .bar").style.width = count.user.pct.toFixed(1)+"%";

            count.tots.pct = (count.tots.com + count.tots.chk + count.tots.del) / count.tots.tot * 100 || 0;
            document.querySelector(".info.tot .pct").innerHTML = count.tots.pct.toFixed(1)+"%";
            document.querySelector(".info.tot .graph .bar").style.width = count.tots.pct.toFixed(1)+"%";

            let lnum = 0;
            document.querySelectorAll(".ia-body table tbody").forEach(tbody => {
                const nodata = tbody.querySelector("tr.nodata");
                nodata ? nodata.remove() : null;
                let vnum = 0;
                tbody.querySelectorAll("tr").forEach( tr => {
                    if( tr.is(":visible") ){
                        vnum++;
                        lnum++;
                        tr.querySelector("td.numb").innerText = lnum;
                    }
                    tbody.setAttribute("trnum",vnum);
                });
                const notr = document.createElement("tr");
                notr.innerHTML = '<td colspan="12">내역이 없습니다</td>';
                notr.classList.add("nodata");
                vnum < 1 ? tbody.appendChild(notr) : null ;
            });
            // console.log("ia.total.set();");
        },
        cate:function(){
            // console.log("ia.total.cate();");
            document.querySelectorAll(".ia-body dd").forEach( dd => {
                const trNum = dd.querySelectorAll("table tbody tr:not(.nodata)").length;
                // console.log(trNum , dd.previousElementSibling );
                dd.previousElementSibling.querySelector("a").setAttribute("data-num",trNum);
            });
        }
    },
    user:{
        init:function(){
            this.evt();
            this.set();
            this.load();
        },
        evt:function(){
            const _this = this;
            document.querySelectorAll(".ia-head .data select").forEach( select => {
                select.addEventListener("change", e => {
                    const val1 = document.querySelector(".fillter").value;
                    const val2 = document.querySelector(".statter").value;
                    this.filt(val1, val2);
                    ia.data.set("ia-"+ia.plat(), {user: val1});
                    ia.data.set("ia-"+ia.plat(), {stat: val2});
                });
            });
        },
        set:function(){
            let optft = '<option value="all">작업자</option>';
            ia.opts.usrs.forEach( k => optft += '<option value="'+k+'">'+k+'</option>' );
            document.querySelector(".fillter").innerHTML = optft;

            let optst = '<option value="all">상태</option>';
            Object.keys(ia.opts.stxt).forEach( k => optst += '<option value="'+k+'">'+k+'</option>' );
            document.querySelector(".statter").innerHTML = optst;
        },
        load:function(){
            const opt1 = ia.data.get("ia-"+ia.plat(),"user") || "all" ;
            const opt2 = ia.data.get("ia-"+ia.plat(),"stat") || "all";
            this.filt(opt1,opt2);
            document.querySelector(".fillter").value = opt1;
            document.querySelector(".statter").value = opt2;
        },
        filt:function(opt1,opt2){
            document.querySelectorAll(".ia-body table.tbl tbody tr").forEach( tr => {
                const tname = tr.querySelector("td.name");
                const tstat = tr.querySelector("td.stat");
                const name = tname ? tname.innerText : null ;
                const stat = tstat ? tstat.innerText : null ;
              
                if( opt1 == name && opt2 == stat ){
                    tr.style.display = "table-row";
                }else{
                    tr.style.display = "none";
                }
                if( opt1 == "all" && opt2 == stat ){
                    tr.style.display = "table-row";
                }
                if( opt1 == name && opt2 == "all" ){
                    tr.style.display = "table-row";
                }
                if( opt1 == "all" && opt2 == "all" ){
                    tr.style.display = "table-row";
                }
                // console.log( opt1,opt2,name,stat   , tr.style.display);
            });
            ia.total.set();
        }
    },
    memo:{
        init:function(){
            this.set();
            this.evt();
        },
        evt:function(){
            document.querySelectorAll("table.tbl td.memo .bt.more").forEach( el => el.addEventListener("click", bt => {
                const td = bt.target.closest("td").classList;
                td.contains("open") ? td.remove("open") : td.add("open");
            }));
            
            document.querySelectorAll("table.tbl th.memo .bt.more").forEach( el => el.addEventListener("click", bt => {
                document.querySelectorAll("table.tbl").forEach( tbl => {
                    if( tbl.classList.contains("open") ) {
                        tbl.classList.remove("open");
                        tbl.querySelectorAll("td.memo").forEach( memo => memo.classList.remove("open"));
                    }else{
                        tbl.classList.add("open");
                        tbl.querySelectorAll("td.memo").forEach( memo => memo.classList.add("open"));
                    }
                });
            }));
        },
        set:function(){
            document.querySelectorAll(".ia-body table.tbl .memo").forEach( memo => {
                const msgs = '<div class="msgs">'+ memo.innerHTML +'</div>';
                const mnum = memo.querySelectorAll("p").length;
                if (mnum >= 2 || memo.tagName == "TH") {
                    memo.classList.add("more");
                    memo.innerHTML  = '<button class="bt more" type="button">+</button>'+ msgs;
                }else{
                    memo.classList.remove("more");
                    memo.innerHTML  = msgs;
                }
            });
        }
    },
    mact:function(num){
        // num = JSON.parse( localStorage.getItem("iaMenuSet") )  ;
        let path = location.pathname.split("/");
        path = "static";
        const active = {"static":"static", "mo":"mo", "pc":"pc", "admin":"admin"};
        // console.log(path ,active , active[path]);
        console.log(ia.plat() , active[path]);
        const liact = document.querySelector(".ia-head .link>li."+active[path]);
        liact && liact.classList.add("active");
        ia.data.set("ia-"+ia.plat(),{plat:active[path]});
        document.querySelector("body").classList.add(active[path]);
        
        num = ia.data.get("ia-"+ia.plat(),"menu") ;

        if( num == 0 ) {
            ia.veiwall.set("open");
        } else {
            if( !num ) {num = 1;} 
            document.querySelector("body."+active[path]+" .ia-body .list>dt.tm"+num+" a").click();
            document.querySelector("body."+active[path]+" .navs .menu>li:nth-child("+num+") a").click();
        }
    },
    veiwall:{
        init:function(){
            this.evt();
        },
        evt:function(){
            var _this = this;
            $(document).on("click",".fixnav .bt.viewall",function() {
                if( $(".ia-body").is(".all") ){
                    _this.set("close");
                }else{
                    _this.set("open");
                }
            });
        },
        set:function(opt){
            if(opt=="open"){
                $(".ia-body").addClass("all");
                $(".fixnav .bt.viewall").text("메뉴닫기");
                // localStorage.setItem("iaMenuSet",0);
                ia.data.set("ia-"+ia.plat(),{menu:0});
            }else{
                $(".ia-body").removeClass("all");
                $(".fixnav .bt.viewall").text("전체보기");
                $(".navs .menu>li:nth-child(1) a").trigger("click");
            }
            ia.total.set();
            ia.update();
        }
    },
    menu:{
        init:function(){
            this.evt();
            this.set();
        },
        evt:function(){
            var _this = this;
            $(document).on("click",".ia-body .list>dt a",function () {
                var idx = parseInt( $(this).closest("dt").attr("class").replace("tm","") );
                ia.veiwall.set("close");
                $(".navs .menu>li:nth-child("+idx+") a").trigger("click");
            });
            $(document).on("click",".navs .menu>li a",function () {
                            
                var idx = parseInt( $(this).closest("li").index()+1 );
                _this.act(idx);
            });
            $(document).on("change",".navs .selt",function () {
                var idx = $(this).val();
                _this.act(idx);
            });
        },
        act:function(idx){
            // console.log(idx);
            $(".ia-body").removeClass("all");
            $(".navs .menu li:nth-child("+idx+")").addClass("active").siblings("li").removeClass("active");	
            $(".navs .selt option[value="+idx+"] ").prop("selected",true);
            // console.log(idx);
            $(".ia-body .list .tm"+idx+"").addClass("active").siblings("dt").removeClass("active");
            $(".ia-body .list .dd"+idx+"").addClass("active").siblings("dd").removeClass("active");

            // localStorage.setItem("iaMenuSet",idx);
            ia.data.set("ia-"+ia.plat(),{menu:idx});
            ia.total.set();
        },
        set:function(){
            var menu = "";
            var selt = "";
            $(".ia-body .list>dt").each(function(idx){
                idx++;
                var count = $(this).find("a[data-num]").attr("data-num");
                count > 0 ? count = ' ['+count+']' : count = '';
                menu += '<li>'+$(this).html()+'</li>';
                selt += '<option value="'+idx+'">'+$(this).find("a").text()+''+count+'</option>';
            });
            // console.log(selt);
            // console.log(menu);
            var navsHtml = '<ul class="menu">'+menu+'</ul><select class="selt" title="카테고리선택">'+selt+'</select>';
            $(".ia-body .navs").append(navsHtml);
        }
    },
    include:{
        init: function(){
            this.set();
        },
        load: function (paramCallback) {
            this.loadCallback = paramCallback; 
        },
        set: function(){
            const incd = document.querySelectorAll("include");
            incd.length ? this.each(incd) : this.acti();
        },
        each: function(incd){ 
            const _this = this;
            const inum = incd.length;
            let cout = 0;
            incd.forEach( els => {
                const url = els.getAttribute("src");
                const opt = JSON.parse(els.getAttribute("data-include-opt")) || {};
                const obj = {};
                Object.keys(opt).forEach( k => obj[k.trim()] = opt[k].trim() );
                _this.fetch = fetch(url)
                .then( res => res.ok ? res.text() : null )
                .then( res => { 
                    cout++;
                    els.innerHTML = res;
                    // console.log(url, obj, cout+"/"+inum);
                    const elc = els.firstElementChild;
                    /* attr */
                    for(const key in obj){
                        const sxt = ( key != "class" && key != "display" && elc ) ;
                        sxt ? elc.setAttribute( key, obj[key] ) : null ;
                    }
                    /* display */
                    elc && obj.display ? elc.style.display = obj.display : null;
                    /* class */
                    const cls = elc && obj.class ? obj.class.split(" ") : null;
                    for(const c in cls) elc.classList.add( cls[c] );
                    /* unwrap */
                    els.replaceWith( ...els.childNodes );
                    cout == inum ? _this.acti() : null;
                });
            });
        },
        acti: function(){
            this.comp = true;
            this.call();
        },
        call: function(){
            typeof this.loadCallback == "function" ? this.loadCallback(): null ;
        }
    }
};

ia.include.set();
ia.include.load( e => ia.init() );