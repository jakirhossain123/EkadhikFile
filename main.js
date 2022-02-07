let duplicateCheckArray = [];
$(document).ready(function() {

    $(".ekadhik-input").each(function (){
       let getName = $(this).attr('name');
       $(this).attr('data-name', getName);
       $(this).removeAttr('name');
    });


    $(".trigger-ekadhik").on("dragover", function(event) {
        event.preventDefault();
        event.stopPropagation();
        $(this).parents('.ekadhik-field').addClass('dragging');
    });
    $(".trigger-ekadhik").on("dragleave", function(event) {
        event.preventDefault();
        event.stopPropagation();
        $(this).parents('.ekadhik-field').removeClass('dragging');
    });

    if (window.File && window.FileList && window.FileReader) {
        // =============== On Drag =====================
        $(".trigger-ekadhik").on("drop", function(event) {
            event.preventDefault();
            event.stopPropagation();
            let self = $(this);
            let attrName = $(this).parents('.ekadhik-field').find('.ekadhik-input').attr('data-name');
            if(event.originalEvent.dataTransfer){
                if(event.originalEvent.dataTransfer.files.length) {
                    event.preventDefault();
                    event.stopPropagation();
                    /*UPLOAD FILES HERE*/
                    upload(event.originalEvent.dataTransfer.files, attrName, self);
                }
            }
            $(this).parents('.ekadhik-field').removeClass('dragging');
        });

        // =============== On Trigger =====================
        $(".ekadhik-input").on("change", function (e) {
            let self = $(this);
            let attrName = $(this).attr('data-name');
            upload(this.files, attrName, self);
        });
    } else {
        alert("Your browser doesn't support to File API")
    }

    // ================= Function for upload image =====================
    function upload(files, attrName, self){
        let inputName = attrName;
        var uploadItemLength = self.parents('.ekadhik-field').find('.upload-item').length;
        let thisAfterList = self.parents('.ekadhik-field').find('.selected-file-list');

        for(let i=0; i<files.length; i++) {

            if (duplicateCheckArray.indexOf(files[i].name) > -1) {
                alert(files[i].name+ ' already selected.');
            } else {


                let dt = new DataTransfer();
                let f = files[i];
                // console.log(f);
                dt.items.add(
                    new File(
                        [f.slice(0, f.size, f.type)],
                        f.name
                    ));



                self.parents('.ekadhik-field').find('.selected-file-list').append(
                    `
                        <li class="selected-ekadik-item">
                            <div class="selected-ekadik-item-content">
                                <input type="file" name="`+ inputName +`" class="d-none attach-file-value" id="attachFile`+i+`">
                                <button type='button' class="remove-ekadik-item"><span class='text'>&times</span></button>
                            </div>
                        </li>
                    `
                );


                let fileReader = new FileReader();
                fileReader.onload = (function (j) {
                    let file = j.target;
                    $("#attachFile"+i).after("<img class=\"uploaded-file\" src=\"" + j.target.result + "\" alt='No preview'/>").removeAttr('id');
                    $("#attachFile"+i).removeAttr('id')
                });
                fileReader.readAsDataURL(f);

                var back = document.getElementById("attachFile"+i);
                back.files = dt.files;
            }
            duplicateCheckArray.push(files[i].name);
        }
        self.parents('.ekadhik-field').find('.ekadhik-input').val('');
    }
});

$(document).on('click', '.remove-ekadik-item', function () {
    if ($(this).parents(".selected-ekadik-item").find('input[type="file"]').length > 0)
    {
        var getVal = $(this).parents(".selected-ekadik-item").find('input[type="file"]').val();

        var getName = getVal.replace(/C:\\fakepath\\/i, '');
        duplicateCheckArray = jQuery.grep(duplicateCheckArray, function(value) {
            return value != getName;
        });
    }
    $(this).parents(".selected-ekadik-item").remove();
});
