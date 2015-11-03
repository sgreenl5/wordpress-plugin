
document.addEventListener('DOMContentLoaded', function(event){

    var modal = el('#idx-shortcode-modal')[0];
    var close = modal.querySelector('.media-modal-close');
    var overlay = el('#idx-overlay')[0];
    var innerContent = el('.idx-modal-inner-content')[0];
    var overView = el('.idx-modal-inner-overview')[0];
    var editOptions = el('.idx-modal-shortcode-edit')[0];
    var insertButton = el('.idx-toolbar-primary button')[0];






    function el(selector){
        return document.querySelectorAll(selector);
    }

    var forEach = function (array, callback, scope) {
      for (var i = 0; i < array.length; i++) {
        callback.call(scope, array[i], i);
      }
    };


    function openShortcodeModal(event) {
        event.preventDefault();
        modal.style.display = 'block';
        overlay.style.display = 'block';
        el('body')[0].style.overflow = 'hidden';
        el('#wpbody')[0].style.zIndex = '160000';
        editOptions.style.display = 'none';
        insertButton.setAttribute('disabled', 'disabled');
    }

    function closeShortcodeModal(event) {
        event.preventDefault();
        modal.style.display = 'none';
        overlay.style.display = 'none';
        el('body')[0].style.overflow = 'initial';
        el('#wpbody')[0].style.zIndex = 'initial';
        overView.style.display = 'block';
        editOptions.innerHTML = '';
    }


    //initialize button and modal functionality
    function initializeModal(){
        el('#idx-shortcode')[0].addEventListener('click', openShortcodeModal);
        overlay.addEventListener('click', closeShortcodeModal);
        close.addEventListener('click', closeShortcodeModal);
        makeTypesSelectable();
        insertButton.addEventListener('click', insertShortcode);

    }

    function makeTypesSelectable(){
        forEach(el('.idx-shortcode-type'), function (value, index) {value.addEventListener('click', getShortcodeData);});
    }

    function getShortcodeData(event){
        shortcodeType = event.target.parentNode.getAttribute('data-short-name');
        jQuery.post(
            ajaxurl, {
                'action': 'idx_shortcode_options',
                'idx_shortcode_type' : shortcodeType
            }).done(function(data){
                insertButton.removeAttribute('disabled');
                overView.style.display = 'none';
                editOptions.style.display = 'block';
                editOptions.innerHTML = data;
        });
    }

    function insertShortcode(event){
        event.preventDefault();
        console.log(event.target);
    }


    initializeModal();





});










