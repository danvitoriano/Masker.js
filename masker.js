Module("Project.modules.Masker", function (Masker) {
    var settings = {
        phone: "(99)9999-9999",
        mobile: "(99)99999-9999",
        cpf: "999.999.999-99",
        cep: "99999-999"
    };

    Masker.fn.initialize = function(element, type, options) {
        $(element.selector).keypress(function () {
            if (event.which != 8 && isNaN(String.fromCharCode(event.which))) {
                event.preventDefault();
            }
        });

        $(element.selector).blur(function () {
          
            if ($(this).context.id == "Cpf") {
                $(this).mask(settings.cpf);
            } else {

                //if ($(this).match(/^(\([1-2][1-9]\)9(4[0-9]|5[0-9]|6[0-9]|7[01234569]|8[0-9]|9[0-9])[0-9]{1})/g))
                //{
                $(this).mask(settings.mobile);
                //}
                // else {
                //    $(this).mask(settings.phone);
                //}
            }
        });

        $.extend(settings, options);
        var self = this;
        this.element = $(element);
        this.mask = settings[type] || "";
        this.type = type;
        this.add = defaultMasker;
        if (this.type === "phone" || this.type === "mobile") this.add = telephoneMasker;
        if (this.type === "money") this.add = moneyMasker;
        if (this.type === "email") this.add = emailMasker;
        if (this.type === "cpf") this.add = CpfMasker;
        if (this.type === "cep") this.add = CepMasker;

        function defaultMasker() {
            self.element.mask(self.mask);
        }

        function moneyMasker() {
            self.element.maskMoney();
        }
        
        function CpfMasker() {
            self.element.mask('999.999.999-99');
        }

        function CepMasker() {
            self.element.mask('99999-999');
        }

        function telephoneMasker() {
            if (self.element.val() != undefined) {
                var _type = (self.element.val().length <= 10) ? "phone" : "mobile";
                self.element.unmask().mask(settings[_type]);
                self.element[0].addEventListener("keypress", function (event) {
                    var phone = $(event.target),
                        mobile_number = phone.val().match(/^(\([1-2][1-9]\)9(4[0-9]|5[0-9]|6[0-9]|7[01234569]|8[0-9]|9[0-9])[0-9]{1})/g);
                    if (mobile_number) {
                        phone.unmask().mask(settings.mobile);
                    } else {
                        phone.unmask().mask(settings.phone);
                    }
                });
            }
        }

        this.add();
    };

    Masker.prototype.cleanVal = function() { //return the unmasked value of element
        this.element.cleanVal();
    };
});