// run after DOM is ready
t_onReady(function () {

    // ------------------------
    // Initialize T686 modules for multiple IDs
    t_onFuncLoad('t686_init', function () {
        t686_init('1813650811');
        t686_init('1813650831');
    });

    // Initialize T336 module
    t_onFuncLoad('t336_init', function () {
        t336_init('1813650821');
    });

    // ------------------------
    // Initialize T446 modules
    t_onFuncLoad('t446_checkOverflow', function () {
        function updateOverflow() {
            t446_checkOverflow('1813650891', '130');
        }

        window.addEventListener('resize', t_throttle(updateOverflow));
        window.addEventListener('load', updateOverflow);
        updateOverflow();
    });

    t_onFuncLoad('t_menu__interactFromKeyboard', function () {
        t_menu__interactFromKeyboard('1813650891');
    });

    t_onFuncLoad('t_menu__highlightActiveLinks', function () {
        t_menu__highlightActiveLinks('.t446__list_item a');
    });

    t_onFuncLoad('t_menu__setBGcolor', function () {
        function updateBG() {
            t_menu__setBGcolor('1813650891', '.t446');
        }

        updateBG();
        window.addEventListener('resize', t_throttle(updateBG));
    });

    t_onFuncLoad('t446_createMobileMenu', function () {
        t446_createMobileMenu('1813650891');
    });

    t_onFuncLoad('t446_init', function () {
        t446_init('1813650891');
    });

    // ------------------------
    // Initialize T686 menu burger
    t_onFuncLoad('t_menuburger_init', function () {
        t_menuburger_init('1813650891');
    });

});

// ------------------------
// Menu burger function
function t_menuburger_init(recid) {
    var rec = document.querySelector('#rec' + recid);
    if (!rec) return;

    var burger = rec.querySelector('.t-menuburger');
    if (!burger) return;

    var isSecondStyle = burger.classList.contains('t-menuburger_second');

    // hover effect for non-mobile second style
    if (isSecondStyle && !window.isMobile && !('ontouchend' in document)) {
        burger.addEventListener('mouseenter', function () {
            if (burger.classList.contains('t-menuburger-opened')) return;
            burger.classList.remove('t-menuburger-unhovered');
            burger.classList.add('t-menuburger-hovered');
        });
        burger.addEventListener('mouseleave', function () {
            if (burger.classList.contains('t-menuburger-opened')) return;
            burger.classList.remove('t-menuburger-hovered');
            burger.classList.add('t-menuburger-unhovered');
            setTimeout(function () { burger.classList.remove('t-menuburger-unhovered'); }, 300);
        });
    }

    // toggle menu on click
    burger.addEventListener('click', function () {
        if (!burger.closest('.tmenu-mobile') &&
            !burger.closest('.t450__burger_container') &&
            !burger.closest('.t466__container') &&
            !burger.closest('.t204__burger') &&
            !burger.closest('.t199__js__menu-toggler')) {
            burger.classList.toggle('t-menuburger-opened');
            burger.classList.remove('t-menuburger-unhovered');
        }
    });

    var menu = rec.querySelector('[data-menu="yes"]');
    if (!menu) return;

    var menuLinks = menu.querySelectorAll('.t-menu__link-item');
    var submenuClassList = [
        't978__menu-link_hook',
        't978__tm-link',
        't966__tm-link',
        't794__tm-link',
        't-menusub__target-link'
    ];

    // close menu when link clicked unless it's a submenu
    Array.prototype.forEach.call(menuLinks, function (link) {
        link.addEventListener('click', function () {
            var isSubmenuHook = submenuClassList.some(function (submenuClass) {
                return link.classList.contains(submenuClass);
            });
            if (isSubmenuHook) return;
            burger.classList.remove('t-menuburger-opened');
        });
    });

    menu.addEventListener('clickedAnchorInTooltipMenu', function () {
        burger.classList.remove('t-menuburger-opened');
    });
}
