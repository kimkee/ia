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
    console.log(this);
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
        usrs:[
            "김기현","홍길동","미지정",
        ],
        stts:["대기","진행","검수","완료","삭제","우선"],
        stxt:{ /* 상태값 class */
            "대기": "sty", "": "sty",
            "진행": "ing", "검수": "chk",
            "완료": "com", "삭제": "del",
            "우선": "wan",
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
        const thtr = document.querySelectorAll(".ia-body table thead tr");
        const tbtr = document.querySelectorAll(".ia-body table tbody tr");
        tbtr.forEach( tr => {
            const stat = tr.querySelector("td.stat");
            const name = tr.querySelector("td.name");
            const txt = stat.innerText;
            !txt ? stat.innerText = '대기':null;
            !name.innerText && tr.classList.add("none");
            !name.innerText ? name.innerText = "미지정" : null ;
            tr.classList.add(ia.opts.stxt[txt]);
            // console.log( txt , !!name.innerText );
            
            const link = tr.querySelector("td.urls a");
            const href = link.getAttribute("href").includes("javascript:;") ? null : link.getAttribute("href").replace("../../html",".");
            link.setAttribute("target","_blank");
            link.innerText =  href;


            tr.querySelector("a").addEventListener("click", e =>{
                e.stopPropagation();
                e.target.closest("tr").classList.add("active");
            });

            tr.addEventListener("click", e =>{
                e.target.closest("tr").classList.toggle("active");
            });

            /* td에 data-label 넣기 */
            Object.keys(ia.opts.label).forEach( k =>{
                // console.log(e,label[e]);
                tr.querySelector("td."+k).setAttribute("data-label",ia.opts.label[k]);
            });
        });

        const dtd = document.querySelectorAll(".ia-body .list>dt");
        dtd.forEach( (e,i) => {
            i++;
            e.classList.add("tm"+i);
            e.nextElementSibling.classList.add("dd"+i);
        });
        
        thtr.forEach( tr => {
            // console.log(tr);
            // el.appendHtml('<th class="numb">No</th>');
        });
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
                '<div class="box">'+
                    '<em class="rt"><i></i><i></i></em>'+
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
            this.set();
            var html = 
            '<ul class="info tot">'+
                '<li>전체 <span class="tot">0</span></li>'+
                '<li>대기 <span class="sty">0</span></li>'+
                '<li>진행 <span class="ing">0</span></li>'+
                '<li>검수 <span class="chk">0</span></li>'+
                '<li>완료 <span class="com">0</span></li>'+
                '<li>삭제 <span class="del">0</span></li>'+
                '<li><em class="graph"><i class="bar"></i></em> <span class="pct">0</span></li>'+
            '</ul>'+
            '<ul class="info usr">'+
                '<li><select class="fillter" title="작업자"><option>작업자</option></select></li>'+
                '<li><select class="statter" title="상태"><option>상태</option></select></li>'+
                '<li><i>전체<span class="tot">0</span></i></li>'+
                '<li><i>대기<span class="sty">0</span></i></li>'+
                '<li><i>진행<span class="ing">0</span></i></li>'+
                '<li><i>검수<span class="chk">0</span></i></li>'+
                '<li><i>완료<span class="com">0</span></i></li>'+
                '<li><i>삭제<span class="del">0</span></i></li>'+
                '<li><em class="graph"><i class="bar"></i></em> <span class="pct">0</span></li>'+
            '</ul>';
            document.querySelector(".ia-head .data").innerHTML = html;
        },
        set:function(){
            ia.loading.show();
            setTimeout( e => ia.loading.hide(), 400 );
            
            const count = {
                tots:{
                    tot: 0, sty: 0, ing: 0, chk: 0, com: 0, del: 0, pct: 0,
                },
                user:{
                    tot: 0, sty: 0, ing: 0, chk: 0, com: 0, del: 0, pct: 0,
                }
            };
            $(".ia-body table.tbl tbody tr:not(.nodata)").each(function(){
                var $sts = $(this).find("td.stat");
                var $txt = $sts.text();
                // console.log($sts.is(":visible"));
                if( $(this).is(":visible") ){
                    count.user.tot++;
                    switch ($txt) {
                        case "대기": count.user.sty++; break;
                        case "진행": count.user.ing++; break;
                        case "검수": count.user.chk++; break;
                        case "우선": count.user.ing++; break;
                        case "완료": count.user.com++; break;
                        case "삭제": count.user.del++; break;
                    }
                }
                count.tots.tot++;
                switch ($txt) {
                    case "대기": count.tots.sty++; break;
                    case "진행": count.tots.ing++; break;
                    case "검수": count.tots.chk++; break;
                    case "우선": count.tots.ing++; break;
                    case "완료": count.tots.com++; break;
                    case "삭제": count.tots.del++; break;
                }
            });


            $(".info.usr .sty").html(count.user.sty);
            $(".info.usr .ing").html(count.user.ing);
            $(".info.usr .chk").html(count.user.chk);
            $(".info.usr .del").html(count.user.del);
            $(".info.usr .com").html(count.user.com);
            $(".info.usr .tot").html(count.user.tot);
            count.user.pct = (count.user.com + count.user.chk + count.user.del) / count.user.tot * 100 || 0;
            $(".info.usr .pct").html( count.user.pct.toFixed(1)+"%");
            $(".info.usr .graph .bar").css("width",count.user.pct.toFixed(1)+"%");
            // console.log(count.user.pct.toFixed(1)+"%");


            $(".info.tot .sty").html(count.tots.sty);
            $(".info.tot .ing").html(count.tots.ing);
            $(".info.tot .chk").html(count.tots.chk);
            $(".info.tot .del").html(count.tots.del);
            $(".info.tot .com").html(count.tots.com);
            $(".info.tot .tot").html(count.tots.tot);
            count.tots.pct = (count.tots.com + count.tots.chk + count.tots.del) / count.tots.tot * 100 || 0;
            $(".info.tot .pct").html( count.tots.pct.toFixed(1)+"%");
            $(".info.tot .graph .bar").css("width",count.tots.pct.toFixed(1)+"%");


            $(".ia-body table tbody tr:visible:not(.nodata)").each(function(i){
                i++;
                $(this).find("td.numb").text(i);
            });

            $(".ia-body table.tbl tr.nodata").remove();	
            $(".ia-body table.tbl tbody").each(function(){
                var $tr = $(this).find(">tr:visible");
                // console.log($tr.length);
                if( $tr.length == 0 ){
                    $(this).append('<tr class="nodata"><td colspan="12">내역이 없습니다</td></tr>');
                }
            });
            
        },
        cate:function(){
            $(".ia-body dd ").each(function(){
                var trNum = $(this).find("table tbody tr:not(.nodata)").length;
                // console.log(trNum);
                // if( trNum <= 0 ) return;
                $(this).prev("dt").find("a").attr("data-num",trNum);
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
            var _this = this;
            $(document).on("change",".ia-head .info select",function(e){
                var val1 = $(".fillter").val();
                var val2 = $(".statter").val();
                _this.filt(val1, val2);
                ia.data.set("ia-"+ia.plat(),{user:val1});
                ia.data.set("ia-"+ia.plat(),{stat:val2});
            });
        },
        set:function(){
            var _this = this;
            for(var count = 0; count < ia.opts.usrs.length; count++){                
                var option = $("<option value="+ia.opts.usrs[count]+">"+ia.opts.usrs[count]+"</option>");
                $(".fillter").append(option);
            }
            for(var countB = 0; countB < ia.opts.stts.length; countB++){                
                var optionB = $("<option value="+ia.opts.stts[countB]+">"+ia.opts.stts[countB]+"</option>");
                $(".statter").append(optionB);
            }
        },
        load:function(){
            var usract1 = ia.data.get("ia-"+ia.plat(),"user") || "작업자" ;
            var usract2 = ia.data.get("ia-"+ia.plat(),"stat") || "상태";
            this.filt(usract1,usract2);
            $(".fillter option[value="+usract1+"] ").prop("selected",true);
            $(".statter option[value="+usract2+"] ").prop("selected",true);
        },
        filt:function(val1,val2){
            // console.log( val1,val2 );
            
            
            $(".ia-body table.tbl tbody tr").hide();
            $(".ia-body table.tbl tbody tr").each(function(i){
                var name = $(this).find("td.name").text();
                var stat = $(this).find("td.stat").text();
                if (name == "") {
                    // $(this).find("td.name").html("미지정");
                    name = "미지정";
                    // console.log(name);
                }

                if( val1 == "담당자" ) {
                    val1 = "작업자" ;
                }
                
                if( val1 == name && val2 == stat ){
                    $(this).show();
                }else{
                    $(this).hide();
                }
                if( val1 == "작업자" && val2 == stat ){
                    $(this).show();
                }
                if( val1 == name && val2 == "상태" ){
                    $(this).show();
                }
                if( val1 == "작업자" && val2 == "상태" ){
                    $(this).show();
                }
                // console.log( val1,name,stat );
            });
            ia.total.set();
        },
        stat:function(val){
            $(".ia-body table.tbl tr td.stat").each(function(i){
                var txt = $(this).text();
                if (txt == "") {
                    // $(this).text("대기");
                    txt = "대기";
                    // console.log(txt);
                }
            });
        }
    },
    memo:{
        init:function(){
            this.evt();
            this.set();
        },
        evt:function(){
            $(document).on("click","table.tbl td.memo .bt.more",function(e){
                if( $(this).closest("td").is(".open") ){
                    $(this).closest("td").removeClass("open");
                }else{
                    $(this).closest("td").addClass("open");
                }
            });
            $(document).on("click","table.tbl th.memo .bt.more",function(e){
                e.stopPropagation();
                console.log("메모+");
                if( $("table.tbl").is(".open") ){
                    $("table.tbl").removeClass("open");
                    $("table.tbl td.memo").removeClass("open");

                }else{
                    $("table.tbl").addClass("open");
                    $("table.tbl td.memo").addClass("open");
                }
            });
        },
        set:function(){
            $(".ia-body table.tbl .memo").each(function(){
                $(this).wrapInner('<div class="msgs"></div>');
                var msg = $(this).find(".msgs>p");
                // console.log(msg.length);
                if (msg.length >= 2) {
                    $(this).addClass("more");
                    !$(this).find(".bt.more").length && $(this).prepend('<button class="bt more" type="button">+</button>');
                }else{
                    $(this).removeClass("more");
                }
            });
            $(".ia-body table.tbl th.memo").each(function(){
                $(".ia-body table.tbl").addClass("close more");
                !$(this).find(".bt.more").length && $(this).prepend('<button class="bt more" type="button">+</button>');
            });
        }
    },
    mact:function(num){
        // num = JSON.parse( localStorage.getItem("iaMenuSet") )  ;
        var path = location.pathname.split("/");
        path = "static";
        var active = {"static":"static", "mo":"mo", "pc":"pc", "admin":"admin"};
        // console.log(path ,active , active[path]);
        $(".ia-head .link>li."+active[path]).addClass("active");
        console.log(ia.plat());
        ia.data.set("ia-"+ia.plat(),{plat:active[path]});
        $("body").addClass(active[path]);
        
        
        num = ia.data.get("ia-"+ia.plat(),"menu") ;
        // console.log(num);
        if( num == 0 ) {
            ia.veiwall.set("open");
        } else {
            if( !num ) {num = 1;} 
            $("body."+active[path]+" .ia-body .list>dt.tm"+num+" a").trigger("click");
            $("body."+active[path]+" .navs .menu>li:nth-child("+num+") a").trigger("click");
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
                    console.log(url, obj, cout+"/"+inum);
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