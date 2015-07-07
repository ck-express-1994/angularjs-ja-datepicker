'use strict';

angular.module('myApp', ['ngMessages'])
    .controller('namesCtrl', function ($scope) {

})
    .filter('wareki', function () {
    /**
     * 和暦のフォーマットに変更する
     *
     * @param str input '2015-01-01'
     *
     * @return string '平成28年1月1日' 
     */
    return function (input) {

        if (!input) {
            return '';

        } else {
            var d_arr = input.split(/[-\/]/),
                toWareki = function (year, month, day) {
                    var wareki = '';
                    year = Number(year);

                    if (year === 1868) {
                        // 9月8日から明治元年 誕生日がここの人はいないだろうから細かくは気にしない
                        wareki = '明治元年';

                    } else if (1868 < year && year < 1912) {
                        year = year - 1867;
                        wareki = '明治' + year + '年';

                    } else if (year === 1912) {
                        year = year - 1867;

                        // 明治46年7月30日まで明治 明治46年7月31日から大正
                        if (month < 7 || (month == 7 && day < 31)) {
                            wareki = '明治' + year + '年';
                        } else {
                            wareki = '大正元年';
                        }

                    } else if (1912 < year && year < 1926) {
                        year = year - 1911;
                        wareki = '大正' + year + '年';

                    } else if (year === 1926) {
                        year = year - 1911;

                        if (month < 12 || (month == 12 && day < 25)) {
                            wareki = '大正' + year + '年';
                        } else {
                            wareki = '昭和元年';
                        }

                    } else if (1926 < year && year < 1989) {
                        year = year - 1925;
                        wareki = '昭和' + year + '年';

                    } else if (year == 1989) {
                        year = year - 1925;

                        if (month === 1 && day < 7) {
                            wareki = '昭和' + year + '年';
                        } else {
                            wareki = '平成元年';
                        }

                    } else if (1988 < year) {
                        year = year - 1988;
                        wareki = '平成' + year + '年';

                    } else {
                        wareki = '--年';
                    }

                    return wareki + month + '月' + day + '日';
                };

            return toWareki(d_arr[0], d_arr[1], d_arr[2]);

        }
    };

})
    .directive('jaDatepicker', function () {
    return {
        restrict: 'A',
        scope: {
            ngModel: '=',
        },
        //基本的にtemplateURLを使った方がいいです。デモのため、templateを使っています。
        //templateURL : 'ja-datepicker.html',

        template: '<div ng-form="myForm">' +
            '<input  ng-model="ngModel" name="name" ng-pattern="/^((19|20)\\d\\d)[\\-\\/](0?[1-9]|1[012])[\\-\\/](0?[1-9]|[12][0-9]|3[01])$/" size="10" maxlength="10" type="text" placeholder="yyyy-mm-dd" class="form-control" />' +
            '<div ng-messages="myForm.name.$error" class="error-message">' +
            '<div ng-message="pattern">正しい日付の形式で入力して下さい。<br/>例）2015-1-30</div>' +
            '</div>' +
            '{{ngModel | wareki}}' +
            '</div>',
        link: function (scope, elm) {

            //console.log(elm);
            $(elm).find('input')
                .datepicker({
                dateFormat: 'yy-mm-dd',
                changeMonth: true,
                changeYear: true,
                yearRange: '1971: 2099',
                showMonthAfterYear: false,
                dayNamesMin: ['日', '月', '火', '水', '木', '金', '土'],
                monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
            })
                .datepicker(
                'option', {
                onSelect: function (value) {

                    scope.$apply(function () {
                        scope.ngModel = value;
                    });
                }
            });
        }
    };
});