(function () {
    const vm = new Vue({
        el:'#app',
        data () {
            return {
                cardList:[{
                    name:'卡片1',
                    code:'card1'
                },{
                    name:'卡片2',
                    code:'card2'
                },{
                    name:'卡片3',
                    code:'card3'
                },{
                    name:'卡片4',
                    code:'card4'
                },{
                    name:'卡片5',
                    code:'card5'
                },{
                    name:'卡片6',
                    code:'card6'
                },{
                    name:'卡片7',
                    code:'card7'
                },{
                    name:'卡片8',
                    code:'card8'
                }],
                // 最左侧显示的卡片
                startIndex:1,
                // 展示的是第几页
                activePage:1,
                // 一共几屏
                screens:0,
                // 定时器，每隔5秒切换一屏
                timer:null
            }
        },
        created() {
            // 初始化一些数据
            this.initData();
        },
        mounted () {
            // 初始化定时器
            this.initTime();
            // 绑定鼠标移动事件
            this.mouseMove();
        },
        methods: {
            // 初始化一些数据
            initData() {
                // 数据的长度
                this.cardLength = this.cardList.length;
                // 每一个li的宽度
                this.oneLiW = 348;
                // 每屏展示4个
                this.everyScreenNum = 4;
                // 展示几屏
                this.screens = Math.ceil(this.cardLength / this.everyScreenNum);
            },
            // 初始化定时器
            initTime() {
                this.$refs.cardBox.classList.add('animate');
                const time = 3500;
                this.timer = setInterval(() => {
                    this.goToNext();
                }, time);
            },
            // 下布局移入事件
            mouseoverBottom() {
                clearInterval(this.timer);
                this.$refs.cardBox.classList.remove('animate');
            },
            // 绑定鼠标移动事件
            mouseMove() {
                const _this = this;
                const dom = this.$refs.List;
                // 是否按下
                let isDown = false;
                // 横向移动的距离
                let x = 0;
                // 鼠标移动的距离
                let nl = 0;
                dom.onmousedown = function (e) {
                    isDown = true;
                    // 获取x坐标和y坐标
                    x = e.clientX;
                    nl = 0;
                };
                dom.onmousemove = function (e) {
                    if (isDown === false) {
                        return;
                    }
                    const nx = e.clientX;
                    nl = nx - x;
                };
                dom.onmouseup = function () {
                    isDown = false;
                    // 鼠标抬起的时候根据移动的正负数判断是向左移动还是向右移动
    
                    // 向右移动
                    if (nl>0) {
                        _this.gotToPrev();
                    } else if (nl<0) {
                        _this.goToNext();
                    }
                };
            },
            gotToPrev(){
                // 如果最左侧显示的图形不为第一个，直接翻滚
                if (this.startIndex > 1) {
                    this.startIndex--;
                } else {
                    // 如果显示的是第一个，把最后一个复制到前面
                    const lastItem = this.cardList.slice(this.cardLength - 1);
                    this.cardList.unshift(lastItem[0]);
                    // 设置bottomList的left值为-312
                    $('#List').css('left', `-${this.oneLiW}px`);
                    this.$nextTick(() => {
                        this.cardList = this.cardList.slice(0, this.cardLength);
                    });
                }
                this.scrollInto();
            },
            goToNext(){
                this.startIndex++;
                this.toNextLi();
            },
            goToPage(item){
                const _index = (item - 1) * this.everyScreenNum + 1;
                if (_index + this.everyScreenNum> this.cardLength) {
                    this.startIndex = this.cardLength - this.everyScreenNum + 1;
                } else {
                    this.startIndex = _index;
                }
                this.toNextLi();
            },
            toNextLi(){
                // 如果后面剩不到一屏
                if (this.startIndex === (this.cardList.length - this.everyScreenNum + 1)) {
                    // 复制第一个到最后一个
                    const firstItem = this.cardList.slice(0, 1);
                    this.cardList.push(firstItem[0]);
                    // 设置left往前一点这样才有动画
                    const left = this.oneLiW * (this.startIndex - 3);
                    $('#List').css('left', `-${left}px`);
                    this.startIndex--;
                    this.$nextTick(() => {
                        this.cardList = this.cardList.slice(1, this.cardList.length);
                    });
                }
                this.scrollInto();
            },
            scrollInto() {
                // 设置当前高亮的页码
                this.activePage = Math.ceil((this.startIndex + 2) / this.everyScreenNum);
                const dom = $('#List');
                const left = this.oneLiW * (this.startIndex - 1);
                dom.animate({left:`${-left}px`});
            }
        },
        beforeDestroy() {
            this.mouseoverBottom();
        }
    })
})()