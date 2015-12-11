/**
 * Character Counter v1.5.1
 * ======================
 *
 * Character Counter is a simple, Twitter style character counter.
 *
 * https://github.com/dtisgodsson/jquery-character-counter
 *
 * @author Darren Taylor
 * @author Email: shout@darrenonthe.net
 * @author Twitter: darrentaytay
 * @author Website: http://darrenonthe.net
 *
 */
(function ($) {

    $.fn.characterCounter = function (opts) {

        var defaults = {
            counterSelector: false,
            limit: 100,
            renderTotal: true,
            counterWrapper: 'span',
            counterCssClass: 'counter',
            counterFormat: '%1 chars',
            exceeded: false,
            counterExceededCssClass: 'exceeded',
            onExceed: function (count) {},
            onDeceed: function (count) {},
            increaseCounting: true,
            targetRange: { "lower":0, "upper": 0},
            hit: false,
            counterMissedCssClass: 'counter-missed',
            counterHitCssClass: 'counter-hit',
            onMissed: function (count) {},
            onHit: function (count) {},
            customFields: {}
        };

        var options = $.extend(defaults, opts);

        return this.each(function () {
            var html5len = $(this).attr('maxlength');
            if (typeof html5len !== typeof undefined && html5len !== false) {
                $.extend(defaults, {
                    limit: parseInt($(this).attr('maxlength'))
                });
            }
            if (!options.counterSelector) {
                $(this).after(generateCounter());
            }
            bindEvents(this);
            checkCount(this);
        });

        function customFields(params) {
            var i, html = '';

            for (i in params) {
                html += ' ' + i + '="' + params[i] + '"';
            }

            return html;
        }

        function generateCounter() {
            var classString = options.counterCssClass;

            if (options.customFields['class']) {
                classString += " " + options.customFields['class'];
                delete options.customFields['class'];
            }

            return '<' + options.counterWrapper + customFields(options.customFields) + ' class="' + classString + '"></' + options.counterWrapper + '>';
        }

        function renderText(count) {
            var renderedCount = options.counterFormat;
            if (options.renderTotal) {
                renderedCount = renderedCount.replace(/%1/, '%1/' + options.limit);
            }
            renderedCount = renderedCount.replace(/%1/, count);
            return renderedCount;
        }

        function checkCount(element) {
            var characterCount = $(element).val().length;
            var counter = options.counterSelector ? $(options.counterSelector) : $(element).nextAll("." + options.counterCssClass).first();
            var remaining = options.limit - characterCount;
            var condition = remaining < 0;

            if (options.increaseCounting) {
                remaining = characterCount;
                condition = remaining > options.limit;
                if (options.targetRange['lower'] >= 0 && options.targetRange['upper']) {
                    if (characterCount <= options.targetRange['upper'] && characterCount >= options.targetRange['lower']) {
                        $(element).addClass(options.counterHitCssClass);
                        $(element).removeClass(options.counterMissedCssClass);
                        options.hit = true;
                        options.onHit(characterCount);
                    } else {
                        if (options.hit) {
                            $(element).addClass(options.counterMissedCssClass);
                            $(element).removeClass(options.counterHitCssClass);
                            options.onMissed(characterCount);
                            options.exceeded = false;
                        }
                    }
                }
            }

            if (condition) {
                counter.addClass(options.counterExceededCssClass);
                options.exceeded = true;
                options.onExceed(characterCount);
            } else {
                if (options.exceeded) {
                    counter.removeClass(options.counterExceededCssClass);
                    options.onDeceed(characterCount);
                    options.exceeded = false;
                }
            }

            counter.html(renderText(remaining));
        }

        function bindEvents(element) {
            $(element)
                .on("input change", function () {
                    checkCount(element);
                });
        }
    };

})(jQuery);