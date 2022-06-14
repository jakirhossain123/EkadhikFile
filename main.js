var ekadhikFileDuplicateCheckArray = [];
$(document).ready(function() {

    $(".ekadhik-input").each(function (){
        let thisIndex = $(this).index();
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
            let targetInput = $(this).parents('.ekadhik-field').find('.ekadhik-input');
            let attrName = targetInput.attr('data-name');
            if(event.originalEvent.dataTransfer){
                if(event.originalEvent.dataTransfer.files.length) {
                    event.preventDefault();
                    event.stopPropagation();
                    /*UPLOAD FILES HERE*/
                    upload(event.originalEvent.dataTransfer.files, attrName, targetInput);
                }
            }
            self.parents('.ekadhik-field').removeClass('dragging');
        });

        // =============== On Trigger =====================
        $(document).on("change",".ekadhik-input", function (e) {
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
        let thisAfterList = self.parents('.ekadhik-field').find('.selected-file-list');
        let fileLimitAttr = self.attr('max');
        let fileLimit = null;
        if (typeof fileLimitAttr != null && typeof fileLimitAttr != 'undefined')
        {
            fileLimit = parseInt(fileLimitAttr);
        }

        for(let i=0; i<files.length; i++) {
            let uploadItemLength = self.parents('.ekadhik-field').find('.selected-ekadik-item').length;
            if (fileLimit != null && uploadItemLength >= fileLimit) {
                alert('You can upload maximum' + ' ( ' + fileLimit + ' ) ' + 'image');
                return false;
            } else {
                if (ekadhikFileDuplicateCheckArray.indexOf(attrName+files[i].name) > -1) {
                    alert(files[i].name + ' already selected.');
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
                                    <input type="file" name="` + inputName + `" class="d-none attach-file-value" id="attachFile` + i + `">
                                    <button type='button' class="remove-ekadik-item"><span class='text'>&times</span></button>
                                </div>
                            </li>
                        `
                    );
                    let fileReader = new FileReader();
                    fileReader.onload = (function (j) {
                        let file = j.target;
                        $("#attachFile" + i).after("<img class=\"uploaded-file\" src=\"" + j.target.result + "\" alt='No preview'/>").removeAttr('id');
                        $("#attachFile" + i).removeAttr('id')
                    });
                    fileReader.readAsDataURL(f);

                    var back = document.getElementById("attachFile" + i);
                    back.files = dt.files;
                }
                ekadhikFileDuplicateCheckArray.push(attrName+files[i].name);
            }
        }
        self.parents('.ekadhik-field').find('.ekadhik-input').val('');
    }
});

// ========== Click For Remove Item =============
$(document).on('click', '.remove-ekadik-item', function (e) {
    e.preventDefault();
    let self = $(this);
    let targetUrl = self.attr('data-remove-url');
    let parseUrl = null;
    if (typeof targetUrl != null && typeof targetUrl != 'undefined')
    {
        parseUrl = targetUrl;
    }
    // ====== Remove Item / Also from server if exist url ============
    if (parseUrl == null)
    {
        $(this).parents(".selected-ekadik-item").remove();
    } else {
        // ======= If Dev Url Exist then work for developer ========
        $.ajax({
            type: 'GET',
            url: parseUrl,
            success: function (info) {
                self.parents('.selected-ekadik-item').remove();
                console.log('success');
            }
        });
    }

    // ==== Remove From Duplicate Array ====
    if ($(this).parents(".selected-ekadik-item").find('input[type="file"]').length > 0)
    {
        let matchInputAttr = $(this).parents(".selected-ekadik-item").find('input[type="file"]').attr('name');
        var getVal = $(this).parents(".selected-ekadik-item").find('input[type="file"]').val();
        var getName = matchInputAttr+getVal.replace(/C:\\fakepath\\/i, '');
        ekadhikFileDuplicateCheckArray = jQuery.grep(ekadhikFileDuplicateCheckArray, function(value) {
            return value != getName;
        });
    }

});
