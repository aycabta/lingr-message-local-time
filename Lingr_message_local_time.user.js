// ==UserScript==
// @name       Lingr message local time
// @license    MIT
// @namespace  http://aycabta.github.io/
// @version    0.0.2
// @description  The Benry Script
// @include    http://lingr.com/
// @copyright  2016+, Code Ass
// ==/UserScript==

(function() {
    var checkID = setInterval(function() {
        if (typeof Timestamp !== "undefined") {
            Timestamp.refresh = function(e) {
                var elem = $(e);
                iso8601Time = elem.find('.iso8601').html();
                if (!iso8601Time || iso8601Time[0] !== '2') {
                    return;
                }
                datetime = new Date();
                var strftime_funks = {
                    zeropad: function( n ){ return n>9 ? n : '0'+n; },
                    a: function(t) { return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][t.getDay()]; },
                    A: function(t) { return ['Sunday','Monday','Tuedsay','Wednesday','Thursday','Friday','Saturday'][t.getDay()]; },
                    b: function(t) { return ['Jan','Feb','Mar','Apr','May','Jun', 'Jul','Aug','Sep','Oct','Nov','Dec'][t.getMonth()]; },
                    B: function(t) { return ['January','February','March','April','May','June', 'July','August',
                        'September','October','November','December'][t.getMonth()]; },
                        c: function(t) { return t.toString(); },
                        C: function(t) {
                            var now = new Date();
                            if (now.getFullYear() != t.getFullYear() ||
                                now.getMonth() != t.getMonth() ||
                                now.getDate() != t.getDate()) {
                                    return " (" + strftime_funks['B'](t) + " " + strftime_funks['D'](t) + strftime_funks['Z'](t) + ")";
                                }
                                else
                                    return "";
                        },
                        d: function(t) { return this.zeropad(t.getDate()); },
                        D: function(t) { return t.getDate(); },
                        H: function(t) { return this.zeropad(t.getHours()); },
                        h: function(t) { return t.getHours(); },
                        I: function(t) { return this.zeropad(((t.getHours() + 12) % 12) || 12); },
                        i: function(t) { return (((t.getHours() + 12) % 12) || 12); },
                        m: function(t) { return this.zeropad(t.getMonth()+1); }, // month-1
                        M: function(t) { return this.zeropad(t.getMinutes()); },
                        p: function(t) { return this.H(t) < 12 ? 'AM' : 'PM'; },
                        P: function(t) { return this.H(t) < 12 ? 'am' : 'pm'; },
                        S: function(t) { return this.zeropad(t.getSeconds()); },
                        w: function(t) { return t.getDay(); }, // 0..6 == sun..sat
                        y: function(t) { return this.zeropad(this.Y(t) % 100); },
                        Y: function(t) { return t.getFullYear(); },
                        Z: function(t) {
                            var now = new Date();
                            if (now.getFullYear() != t.getFullYear()) {
                                return " " + t.getFullYear();
                            }
                            else
                                return "";
                        },
                        '%': function(t) { return '%'; }
                };
                datetime.strftime = function (fmt) {
                    var t = this;
                    for (var s in strftime_funks) {
                        if (s.length == 1 )
                            fmt = fmt.replace('%' + s, strftime_funks[s](t));
                    }
                    return fmt;
                };
                datetime.updateFromISO8601 = function (string) {
                    var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +
                        "(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" +
                            "(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
                            var d = string.match(new RegExp(regexp));

                            var offset = 0;
                            var date = new Date(d[1], 0, 1);

                            if (d[3]) { date.setMonth(d[3] - 1); }
                            if (d[5]) { date.setDate(d[5]); }
                            if (d[7]) { date.setHours(d[7]); }
                            if (d[8]) { date.setMinutes(d[8]); }
                            if (d[10]) { date.setSeconds(d[10]); }
                            if (d[12]) { date.setMilliseconds(Number("0." + d[12]) * 1000); }
                            if (d[14] && d[14] != 'Z') {
                                offset = (Number(d[16]) * 60) + Number(d[17]);
                                offset *= ((d[15] == '-') ? 1 : -1);
                            }

                            offset -= date.getTimezoneOffset();
                            time = (Number(date) + (offset * 60 * 1000));
                            this.setTime(Number(time));
                };
                datetime.updateFromISO8601(iso8601Time);
                diff = (new Date() - datetime) / 1000;
                elem.find('.relative').html(datetime.strftime('%Y-%m-%d %H:%M:%S ') + Timestamp.humanizeDifference(diff));
                return elem.find('.timestamp').attr('title', datetime.strftime('%i:%M%P on %B %D%Z'));
            };
            Timestamp.updateTimestamp();
            clearInterval(checkID);
        }
    }, 1000);
})();
