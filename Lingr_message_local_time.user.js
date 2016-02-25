// ==UserScript==
// @name        Lingr message local time
// @namespace   http://aycabta.github.io/
// @version    0.0.1
// @description  The Benry Script
// @include    http://lingr.com/
// @copyright  2016+, Code Ass
// ==/UserScript==

(function() {
    Timestamp.refresh = function(e) {
        var elem = $(e);
        iso8601Time = elem.find('.iso8601').html();
        if (!iso8601Time || iso8601Time[0] !== '2') {
            return;
        }
        datetime = new Date();
        datetime.updateFromISO8601(iso8601Time);
        diff = (new Date() - datetime) / 1000;
        elem.find('.relative').html(datetime.strftime('%Y-%m-%d %H:%M:%S ') + this.humanizeDifference(diff));
        return elem.find('.timestamp').attr('title', datetime.strftime('%i:%M%P on %B %D%Z'));
    }
})();
