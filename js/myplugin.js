!function($) {
    $.fn.extend({

        /**
         * 時間表示を動的に変化させる
         * @param {Array} settings 表示設定配列
         *　　　　             ├ threshold      : 現在時間と指定された時間の差のミリ秒に対する閾値(この範囲に収まっていればこの配列番号の設定情報で時間を加工) ※小さい閾値から指定すること
         *　　　　             ├ format         : 時間表示フォーマット(現在時間と指定された時間の差のミリ秒 / unitの値は%time%で取得可能)
         *　　　　             ├ unit           : 現在時間と指定された時間の差のミリ秒を割る単位
         *　　　　             ├ refreshRate    : 時間表示を次に更新するまでのミリ秒(マイナス値がしてされた場合更新を行わない)
         *　　　　             └ dateDisplayFlag: 日付書式形式フラグ(日付書式表示: true; 時間差表示: false)
         * @return this
         */
        magicTime : function(settings){
            return this.each(function() {
                var timeElement = $(this),
                    now = new Date(),
                    other,
                    settings,
                    refreshRate,
                    timerId,
                    refreshFlag = false,
                    past = 0;

                this.settings = [
                    {
                        threshold: 1000 * 60,
                        format: '%time%' + '秒前',
                        unit: 1000,
                        refreshRate: 1000,
                        dateDisplayFlag: false
                    },
                    {
                        threshold: 1000 * 60 * 60,
                        format: '%time%' + '分前',
                        unit: 1000 * 60,
                        refreshRate: 1000 * 60,
                        dateDisplayFlag: false
                    },
                    {
                        threshold: 1000 * 60 * 60 * 24,
                        format: '%time%' + '時間前',
                        unit: 1000 * 60 * 60,
                        refreshRate: 1000 * 60 * 60,
                        dateDisplayFlag: false
                    },
                    {
                        threshold: 1000 * 60 * 60 * 24 * 365,
                        format: 'yyyy年MM月dd日',
                        unit: 1000 * 60 * 60 * 24,
                        refreshRate: -1,
                        dateDisplayFlag: true
                    }
                ];

                settings = settings || this.settings;

                other = unix2date(timeElement.data('time'));

                setMagicTime(other, settings);

                function unix2date(dataString) {
                    return new Date(parseInt(dataString, 10) * 1000);
                }

                function setMagicTime(other, settings){
                    var i,
                        length,
                        nowTime = now.getTime() + past,
                        otherTime = other.getTime(),
                        difference = nowTime - otherTime,
                        time,
                        timeString;

                    for(i = 0, length = settings.length; i < length; i++){
                        if(settings[i].dateDisplayFlag){
                            timeString = settings[i].format;
                            timeString = timeString.replace(/yyyy/, other.getFullYear());
                            timeString = timeString.replace(/yy/, other.getYear());
                            timeString = timeString.replace(/MM/, other.getMonth() + 1);
                            timeString = timeString.replace(/dd/, other.getDate());
                            timeString = timeString.replace(/HH/, other.getHours());
                            timeString = timeString.replace(/mm/, lPad(other.getMinutes(), 2, '0'));
                            timeString = timeString.replace(/ss/, lPad(other.getSeconds(), 2, '0'));
                            timeString = timeString.replace(/mi/, lPad(other.getMilliseconds(), 2, '0'));
                            timeString = timeString.replace(/day/, other.getDay());

                            if(refreshRate !== settings[i].refreshRate){
                                refreshRate = settings[i].refreshRate;
                                refreshFlag = true;
                            }
                            break;
                        }

                        if(difference < settings[i].threshold){
                            time = Math.round(difference / settings[i].unit);
                            timeString = settings[i].format.replace(/%time%/, time);

                            if(refreshRate !== settings[i].refreshRate){
                                refreshRate = settings[i].refreshRate;
                                refreshFlag = true;
                            }
                            break;
                        }
                    }
                    timeElement.text(timeString);

                    if(refreshFlag){
                        clearInterval(timerId);
                        if(0 < refreshRate){
                            timerId = setInterval(function(){
                                past += refreshRate;
                                setMagicTime(other, settings);
                            }, refreshRate);
                        }
                        refreshFlag = false;
                    }

                    return refreshRate;
                }

                function lPad(value, digit, filling){
                    value = value + '';
                    while(value.length < digit){
                        value = filling + value;
                    }
                    return value;
                }
            });
        },

        /**
         * @method scrollEnd
         * @description trigger "scrollEnd" Event
         * @return this
         */
        scrollEnd: function() {
            var self = this;

            $(window).on('scroll', function(e) {
                var windowElement = $(window),
                    scrollTop = windowElement.scrollTop(),
                    scrollHeight = document.body.scrollHeight,
                    windowHeight = windowElement.outerHeight();

                if(scrollHeight - (scrollTop + windowHeight) < 100) {
                    self.each(function() {
                        $(this).trigger('scrollEnd');
                    });
                }
            });
        },
        /**
         * @method resizeTextarea
         * @description make textarea resizable
         * @return this
         */
        resizeTextarea: function(){
            return this.each(function() {
                var self = $(this),
                    minHeight = self.innerHeight(),
                    scrollHeight;
                
                self.bind({
                    'keydown': function(){setTimeout(resize, 0);},
                    'paste':   function(){setTimeout(resize, 0);},
                    'cut':     function(){setTimeout(resize, 0);},
                    'blur':    resize
                });
                
                function resize(){
                    var scrollHeight = self.prop('scrollHeight');
                    while(true){
                        scrollHeight = self.prop('scrollHeight');
                        if(scrollHeight <= minHeight) break;
                        self.outerHeight(scrollHeight - 5);
                        if(self.prop('scrollHeight') === scrollHeight) break;
                    }
                    if(minHeight < scrollHeight){
                        self.outerHeight(scrollHeight);
                    }
                    return false;
                }
            });
        }
    });
}.call(window, jQuery);