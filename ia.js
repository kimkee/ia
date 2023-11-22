/**
 * @IA - HTML Works List
 * @link https://github.com/kimkee/ia/
 * @author 김기현 KimKeeHyun <kimkee7@gmail.com>
 * @version 1.0.1
 * @update 2022-09-01
 * @licence MIT
 */
const ia = {
    init: function(){
        this.stats.init();
        this.total.init();
        this.user.init();
        this.menu.init();
        this.fixnav.init();
        this.veiwall.init();
        this.mact.init();
        this.memo.init();
        this.ly.init();
    },
    update: function(){
        this.ly.set();
    },
    opts: {
        usrs: [
            "김기현", "홍길동", "김선생", "미지정",
        ],
        stxt: { /* 상태값 class */
            "대기": "sty", "진행": "ing", "검수": "chk", "완료": "com", "삭제": "del", "우선": "wan",
        },
        label: { /* td라벨 */
            numb: "No", lev2: "Lv.2", lev3: "Lv.3", lev4: "Lv.4", lev5: "Lv.5",
            tits: "화면", code: "ID", urls: "파일", date: "날짜", stat: "상태", name: "담당", memo: "메모",
        },
    },
    data: {
        set: function(name,obj){
            let orgs = JSON.parse( localStorage.getItem(name) ) || {};
            let news = obj;
            if( typeof obj == "object" ){
                news = Object.assign(orgs,news);
            }
            localStorage.setItem( name, JSON.stringify(news) );
        },
        get: function(name,key){ // console.log(key);
            let data = JSON.parse( localStorage.getItem(name) ) || {};
            return data[key];
        },
    },
    plat: e => {
        let path = location.pathname.split("/")[1] ;
        const active = {"mo":"mo", "pc":"pc", "admin":"admin"};
        if( !Object.hasOwnProperty.call(active, path) ) path = "mo";
        return path;
    },
    stats: {
        init: function(){
            this.set();
        },
        set: function(){
            const tbtr = document.querySelectorAll(".ia-body table tbody tr");
            tbtr.forEach( tr => {
                const stat = tr.querySelector("td.stat");
                const name = tr.querySelector("td.name");
                const urls = tr.querySelector("td.urls");
                const txt = stat.innerText;
                !txt ? stat.innerText = '대기':null;
                !name.innerText && tr.classList.add("none");
                !name.innerText ? name.innerText = "미지정" : null ;
                tr.classList.add(ia.opts.stxt[txt]||'sty');
                urls.insertAdjacentHTML("beforeend",'<button type=button class="bt-copy"><i>Copy</i></button>');
                const link = tr.querySelector("td.urls a");
                const href = link.getAttribute("href");
                link.setAttribute("target","_blank");
                link.innerText = href.includes("javascript:;") ? null : href.replace("../../html",".");
                link.addEventListener("click", bt => {
                    bt.stopPropagation();
                    bt.target.closest("tr").classList.add("active");
                });
                tr.addEventListener("click", e => tr.classList.toggle("active"));
                urls.querySelector(".bt-copy").addEventListener("click", bt => {
                    bt.stopPropagation();
                    const furl = link.innerText.split("/").reverse();
                    navigator.clipboard.writeText(furl[1]+"/"+furl[0]);
                    urls.classList.add("copied");
                    setTimeout( e => urls.classList.remove("copied"), 500);
                });
                /* td에 data-label 넣기 */
                Object.keys(ia.opts.label).forEach( k => tr.querySelector("td."+k).setAttribute("data-label",ia.opts.label[k]) );
            });
        }
    },
    mact: {
        init: function(){
            this.set();
        },
        set:function(num){
            let path = ia.plat(); // console.log(path);
            const liact = document.querySelector(".ia-head .link>li."+path);
            liact && liact.classList.add("active");
            ia.data.set("ia-"+path,{plat:path});
            document.querySelector("body").classList.add(path);
            num = ia.data.get("ia-"+path,"menu") ;
            if( num == 0 ) {
                ia.veiwall.set("open");
            } else {
                ia.veiwall.set("close");
                ia.menu.act(num||1);
            }
        }
    },
    ly: {
        init: function(){
            this.evt();
            this.set();
        },
        evt: function(){
            window.addEventListener("load",   e => this.set());
            window.addEventListener("resize", e => this.set());
            window.addEventListener("scroll", e => this.set());
        },
        set: function(){
            document.title = "IA-"+ia.plat().toUpperCase();
            const hdHeight = document.querySelector(".ia-head").offsetHeight  || 0;
            const nvHeight = document.querySelector(".ia-body .navs").offsetHeight || 0;
            // console.log(hdHeight , nvHeight);
            document.querySelector(".ia-wrap").style.paddingTop = hdHeight+"rem";
            document.querySelector(".ia-body").style.paddingTop = nvHeight+"rem";
            document.querySelector(".ia-body .fixs").style.top = hdHeight+nvHeight+"rem";
            document.querySelector(".ia-body .navs").style.top = hdHeight+"rem";
        }
    },
    fixnav: {
        init: function(){
            document.querySelector(".fixs").insertAdjacentHTML("beforeend",this.els);
            this.evt();
            const theme = ia.data.get("ia","theme");
            this.them(theme);
        },
        els:`<nav class="fixnav">
                <button type="button" class="bt vall"></button>
                <button type="button" class="bt them"></button>
                <button type="button" class="bt tops"></button>
            </nav>`,
        evt: function(){
            document.querySelector(".fixnav .bt.tops").addEventListener("click", e => this.gotop(e.target) );
            document.querySelector(".fixnav .bt.them").addEventListener("click", e => ia.data.get("ia","theme") == "dark" ? this.them("light") : this.them("dark"));
        },
        gotop: function(el){
            window.scrollTo(0, 0);
        },
        them: function(type){
            const bcls = document.querySelector("body").classList;
            const bthm = document.querySelector(".fixnav .bt.them");
            const tclr = document.querySelector('[name="theme-color"]');
            type = !type ? "dark" : type;
            bthm.innerText = type == "dark" ? "🌚" : "🌞";
            type == "dark" && bcls.add("is-dark");    tclr.setAttribute("content","#212121");
            type == "light"&& bcls.remove("is-dark"); tclr.setAttribute("content","#ffffff");
            ia.data.set("ia",{theme:type});
        }
    },
    loading: { // 로딩중..
        show: function () {
            if( document.querySelector(".ia-loading") ) return;
            const els = 
            `<div class="ia-loading"><div class="bx"><em><i></i></em></div></div>`;
            document.querySelector("body").insertAdjacentHTML("afterbegin",els);
            document.querySelector("body").classList.add("is-loading");
        },
        hide: function () {
            const loading = document.querySelector(".ia-loading");
            if (loading) {
                loading.remove();
                document.querySelector("body").classList.remove("is-loading");
            }
        }
    },
    total: {
        init: function(){
            this.cate();
        },
        set: function(){
            ia.loading.show();
            setTimeout( e => ia.loading.hide(), 400 );
            
            const count = {
                tots: { tot: 0, sty: 0, ing: 0, chk: 0, com: 0, del: 0, wan: 0, pct: 0 },
                user: { tot: 0, sty: 0, ing: 0, chk: 0, com: 0, del: 0, wan: 0, pct: 0 }
            };
            document.querySelectorAll(".ia-body  table.tbl tbody tr:not(.nodata)").forEach( tr => {
                const sxt = tr.querySelector("td.stat");
                const txt = sxt.innerText;
                const ttt = ia.opts.stxt[txt];

                count.tots.tot++;
                count.tots[ttt]++;
                if( tr.style.display == "table-row" && tr.closest("li.show")  ){ 
                    count.user.tot++;
                    count.user[ttt]++;
                }
            });
            Object.keys(count.tots).forEach( k => document.querySelector(".info.tot ."+k).innerText = count.tots[k] );
            Object.keys(count.user).forEach( k => document.querySelector(".info.usr ."+k).innerText = count.user[k] );

            count.user.pct = (count.user.com + count.user.chk + count.user.del) / count.user.tot * 100 || 0;
            document.querySelector(".info.usr .pct").innerHTML =  count.user.pct.toFixed(1)+"%" ;
            document.querySelector(".info.usr .graph .bar").style.width = count.user.pct.toFixed(1)+"%";

            count.tots.pct = (count.tots.com + count.tots.chk + count.tots.del) / count.tots.tot * 100 || 0;
            document.querySelector(".info.tot .pct").innerHTML = count.tots.pct.toFixed(1)+"%";
            document.querySelector(".info.tot .graph .bar").style.width = count.tots.pct.toFixed(1)+"%";

            let lnum = 0;
            document.querySelectorAll(".ia-body li.show table tbody").forEach(tbody => {
                const nodata = tbody.querySelector("tr.nodata");
                nodata && nodata.remove();
                let vnum = 0;
                tbody.querySelectorAll("tr").forEach( tr => {
                    if( tr.style.display == "table-row" ){
                        vnum++;
                        lnum++;
                        tr.querySelector("td.numb").innerText = lnum;
                    }
                });
                tbody.setAttribute("trnum", vnum);
                const notr = `<tr class="nodata"><td colspan="12">내역이 없습니다.</td></tr>`;
                vnum < 1 && tbody.insertAdjacentHTML("beforeend",notr);
                
            });
            // console.log("ia.total.set();");
        },
        cate: function(){
            // console.log("ia.total.cate();");
            document.querySelectorAll(".ia-body .list>li").forEach( li => {
                const trs = li.querySelectorAll("table tbody tr:not(.nodata)").length;
                li.querySelector(".bt").setAttribute("data-num",trs);
            });
        }
    },
    user: {
        init: function(){
            this.evt();
            this.load();
            this.sets();
        },
        evt: function(){
            document.querySelectorAll(".ia-head .data select").forEach( sel => sel.addEventListener("change", e => this.sets() ));
        },
        load: function(){
            let optft = `<option value="all">작업자</option>`;
            let optst = `<option value="all">상태</option>`;
            Object.keys(ia.opts.usrs).forEach( k => optft += `<option value="${ia.opts.usrs[k]}">${ia.opts.usrs[k]}</option>` );
            Object.keys(ia.opts.stxt).forEach( k => optst += `<option value="${k}">${k}</option>` );
            document.querySelector(".fillter").innerHTML = optft;
            document.querySelector(".statter").innerHTML = optst;
           
            const opt1 = ia.data.get("ia-"+ia.plat(), "user") || "all";
            const opt2 = ia.data.get("ia-"+ia.plat(), "stat") || "all";
            document.querySelector(".fillter").value = opt1;
            document.querySelector(".statter").value = opt2;
        },
        sets: function(){
            const opt1 = document.querySelector(".fillter").value;
            const opt2 = document.querySelector(".statter").value;
            ia.data.set("ia-"+ia.plat(), {user: opt1});
            ia.data.set("ia-"+ia.plat(), {stat: opt2});
            this.filt(opt1, opt2);
        },
        filt: function(opt1,opt2){ // console.log("ia.usr.filt()");
            document.querySelectorAll(".ia-body table.tbl tbody tr").forEach( tr => {
                const tname = tr.querySelector("td.name");
                const tstat = tr.querySelector("td.stat");
                const name = tname && tname.innerText;
                const stat = tstat && tstat.innerText;

                tr.style.display = "none";
                opt1 == name  && opt2 == stat  ? tr.style.display = "table-row" : null ;
                opt1 == name  && opt2 == "all" ? tr.style.display = "table-row" : null ;
                opt1 == "all" && opt2 == stat  ? tr.style.display = "table-row" : null ;
                opt1 == "all" && opt2 == "all" ? tr.style.display = "table-row" : null ;
            });
            ia.total.set();
        }
    },
    menu: {
        init: function(){
            this.set();
            this.evt();
        },
        evt: function(){
            document.querySelectorAll(".ia-body .list>li .bt").forEach( (bt,i) => {
                i++;
                bt.setAttribute("onclick",`ia.menu.act(${i})`);
                bt.addEventListener("click", a => ia.veiwall.set("close"));
            } );
            document.querySelectorAll(".navs .menu>li .bt").forEach( (bt,i) => bt.addEventListener("click", a => this.act( i+1 ) ) );
            document.querySelector(".fixs .selt").addEventListener("change", sel => this.act(sel.target.value) );
        },
        act: function(idx){ // console.log(idx);
            document.querySelector(".ia-body").classList.remove("all");
            document.querySelectorAll(".navs .menu>li").forEach( (li,i) => {
                idx == i+1 ? li.classList.add("active") : li.classList.remove("active");
            });
            document.querySelector(".fixs .selt option[value='"+idx+"']").selected = true;
            document.querySelectorAll(".ia-body .list>li").forEach( (li,i) => {
                idx == i+1 ? li.classList.add("active","show") : li.classList.remove("active","show");
            });
            ia.data.set("ia-"+ia.plat(),{menu:idx});
            ia.total.set();
        },
        set: function(){
            let menu = ``;
            let selt = ``;
            document.querySelectorAll(".ia-body .list>li").forEach( (li,idx) => {
                idx++;
                const bt = li.querySelector(".bt");
                let nums = bt.getAttribute("data-num");
                nums = nums > 0 ? `${nums}` : ``;
                menu += `<li><button class="bt" data-num="${nums}">${bt.innerHTML}</button></li>`;
                selt += `<option value="${idx}">${bt.innerText} [${nums}]</option>`;
            });
            // console.log(selt,menu);
            document.querySelector(".ia-body .navs").innerHTML = `<ul class="menu">${menu}</ul>`;
            document.querySelector(".ia-body .fixs").innerHTML = `<select class="selt">${selt}</select>`;
        }
    },
    memo: {
        init: function(){
            this.set();
            this.evt();
        },
        evt: function(){
            document.querySelectorAll("table.tbl td.memo .bt-more").forEach( el => el.addEventListener("click", bt => {
                bt.stopPropagation();
                const td = bt.target.closest("td").classList;
                td.contains("open") ? td.remove("open") : td.add("open");
            }));

            document.querySelectorAll("table.tbl th.memo .bt-more").forEach( el => el.addEventListener("click", bt => {
                document.querySelectorAll("table.tbl").forEach( tbl => {
                    if( tbl.classList.contains("open") ) {
                        tbl.classList.remove("open");
                        tbl.querySelectorAll("td.memo").forEach( td => td.classList.remove("open"));
                    }else{
                        tbl.classList.add("open");
                        tbl.querySelectorAll("td.memo").forEach( td => td.classList.add("open"));
                    }
                });
            }));
        },
        set: function(){
            document.querySelectorAll(".ia-body table.tbl .memo").forEach( memo => {
                const msgs = `<div class="msgs">${memo.innerHTML}</div>`;
                const mnum = memo.querySelectorAll("p").length;
                if (mnum >= 2 || memo.tagName == "TH") {
                    memo.classList.add("more");
                    memo.innerHTML = `<button class="bt-more" type="button"></button>`+ msgs;
                }else{
                    memo.classList.remove("more");
                    memo.innerHTML = msgs;
                }
            });
        }
    },
    veiwall: {
        init: function(){
            this.evt();
        },
        evt: function(){           
            document.querySelector(".fixnav .bt.vall").addEventListener("click", bt => {
                const isAll = bt.target.closest(".ia-body").classList.contains("all");
                isAll ? this.set("close") : this.set("open");
            });
        },
        set: function(opt){
            const body = document.querySelector(".ia-body");
            const vbtn = document.querySelector(".fixnav .bt.vall");
            if( opt == "open" ){
                body.classList.add("all");
                vbtn.innerText = "메뉴닫기";
                ia.data.set("ia-"+ia.plat(),{menu:0});
                document.querySelectorAll(".list>li").forEach( dd => dd.classList.add("show") );
            }
            if( opt == "close" ){
                body.classList.remove("all");
                vbtn.innerText = "전체보기";
                const acts = document.querySelectorAll(".ia-body .navs .menu>li.active").length;
                document.querySelectorAll(".list>li:not(.active)").forEach( dd => dd.classList.remove("show") );
                acts == 0 && ia.menu.act(1);
            }
            ia.total.set();
            ia.update();
        }
    },
    include: {
        init: function(){
            this.set();
        },
        load: function(paramCallback){
            this.loadCallback = paramCallback; 
        },
        set: function(){
            const incd = document.querySelectorAll("include");
            incd.length ? this.each(incd) : this.acti();
        },
        each: function(incd){ 
            const inum = incd.length;
            let cout = 0;
            incd.forEach( els => {
                const url = els.getAttribute("src");
                const opt = JSON.parse(els.getAttribute("data-include-opt")) || {};
                const obj = {};
                Object.keys(opt).forEach( k => obj[k.trim()] = opt[k].trim() );
                this.fetch = fetch(url).then( res => res.ok && res.text() ).then( res => { 
                    cout++;
                    els.innerHTML = res;
                    const elc = els.firstElementChild;
                    // console.log(cout+"/"+inum, url, obj);
                    /* attr */
                    Object.keys(obj).forEach( k => k != "class" && k != "display" && elc && elc.setAttribute( k, obj[k] ) );
                    /* display */
                    elc && obj.display ? elc.style.display = obj.display : null;
                    /* class */
                    const cls = elc && obj.class ? obj.class.split(" ") : [];
                    Object.keys(cls).forEach( c => elc.classList.add(cls[c]) );
                    /* unwrap */
                    els.replaceWith( ...els.childNodes );
                    cout == inum && this.acti();
                });
            });
        },
        acti: function(){
            this.comp = true;
            this.call();
        },
        call: function(){
            typeof this.loadCallback == "function" && this.loadCallback();
        }
    },
};
ia.loading.show();
ia.include.set();
ia.include.load( e => setData() );

const data = [];
const setData = e =>{
    document.querySelectorAll(".ia-body .list>li").forEach( (li,idx) => {
        data[idx] =  {"lev1": li.querySelector(".bt").innerText};
        data[idx].page = [];
        li.querySelectorAll("tbody tr").forEach( (tr, i) => {
            const stat = tr.querySelector("td.stat").innerText;
            const name = tr.querySelector("td.name").innerText;
            const lev2 = tr.querySelector("td.lev2").innerText;
            const lev3 = tr.querySelector("td.lev3").innerText;
            const lev4 = tr.querySelector("td.lev4").innerText;
            const lev5 = tr.querySelector("td.lev5").innerText;
            const tits = tr.querySelector("td.tits").innerText;
            const code = tr.querySelector("td.code").innerText;
            const date = tr.querySelector("td.date").innerText;
            const urls = tr.querySelector("td.urls>a").getAttribute("href");
            const memo = [];
            tr.querySelectorAll("td.memo p").forEach( p => memo.push(p.innerText) );
            data[idx].page[i] = {
                "numb": i +1, "lev2": lev2, "lev3": lev3, "lev4": lev4, "lev5": lev5, "tits": tits, 
                "code": code, "date": date, "stat": stat, "name": name, "urls": urls, "memo": memo,
            };
        });
        // console.log(data[idx].lev1);
        // console.table(data[idx].page);
    });
    ia.init();
    console.log(data);
    ia.data.set("ia-data",data);
};
document.querySelectorAll(".example a").forEach( a => {
    console.log(  a.getAttribute("href") );
});