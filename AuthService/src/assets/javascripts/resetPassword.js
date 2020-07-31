$(document).ready(function (e) {
    $('label').on('click', function (e) {
        // If you click on the label we force-focus to the input
        var input = $(this).attr('for');
        $('input[name="' + input + '"]').focus();
    });

    $('input,textarea,select').on('focus', function (e) {
        var input = $(this).attr('name');
        $('label[for="' + input + '"]').removeClass('idleLabel').addClass('activeLabel');
    }).on('blur', function (e) {
        if (($(this).is('input,textarea') && $(this).val() == '') || ($(this).is('select') && $(this).val() == 0)) {
            var input = $(this).attr('name');
            $('label[for="' + input + '"]').removeClass('activeLabel').addClass('idleLabel');
            debugger;
            if ($(this).hasClass('isRequired')) {
                $(this).closest('div').find('i').removeClass('fa-star-o fa-check text-warning text-success').addClass('fa-star text-danger').attr('title', 'The field cannot be left blank');
            }
        } else {
            $(this).closest('div').find('i').removeClass('fa-star-o fa-star text-warning text-danger').addClass('fa-check text-success').attr('title', 'Field populated');
        }
    });
});
