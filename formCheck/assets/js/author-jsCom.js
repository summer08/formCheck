	function checkForm(options){
		var defaults = {
			regexp:{
				tel: /^1[3|4|5|8][0-9]\d{4,8}$/,
				qq: /^[1-9][0-9]{4,}$/
			}
		}
		this.opts = $.extend(defaults, options);
		this.init();
	}
	//验证
	checkForm.prototype.check = function($this){
		var that = this;
		var emptyMes = $this.attr('data-empty'),
			errorMes = $this.attr('data-error'),
			currentVal = $this.val();
   		if($this.attr('data-oldVal') != currentVal){
   			if(!that.checkRequired($this,emptyMes)) return false;
   			$this.attr('data-oldVal', currentVal);//验证通过标识
   			if(!that.checkRegexp($this,errorMes)) return false;
   			if(typeof($this.attr('data-ajax')) != 'undefined'){
   				var name = $this.attr('data-ajax');
				var item = that.opts.dataRemote[name],
				    ajaxurl = item.url,
	   			    params = item.data,
	   			    callBackFun = item.callback;
	   			    item.data.name = currentVal;
   			    that.ajaxFetch(ajaxurl,params,function(data){
   					callBackFun(data, $this, that.passTip($this), function(mes){that.errorMes($this,mes)});
   				});
   			}else{
   				that.passTip($this);
   				that.passStyleCss();
   			}
   		}else{
   			$this.attr('data-pass') == 'pass' ? that.passTip($this) : that.errorMes($this,errorMes);
   		}
	}
	//事件绑定
	checkForm.prototype.bindEvent = function(){
		var that = this;
		$('input[type="text"]:required').on('blur',function(){
			that.check($(this))
		})
		.on('focus',function(){
			$(this).closest('.form-item').removeClass('check-warn check-success');
		})
	}
	//验证通过
	checkForm.prototype.passTip = function($this){
		$this.attr('data-pass','pass').closest('.form-item').removeClass('check-warn').addClass('check-success');
	}
	//验证未通过
	checkForm.prototype.errorMes = function($el,mes){
		var that = this;
		$el.closest('.form-item').addClass('check-warn').removeClass('check-success').find('.check-info p.text').text(mes);
		$el.removeAttr('data-pass');
		that.passStyleCss();
		return false;
	}
	//验证为空
	checkForm.prototype.checkRequired = function($el,emptyMes){
		var that = this;
		if(!$.trim($el.val())) return that.errorMes($el,emptyMes);
		return true;
	}
	//验证正则
	checkForm.prototype.checkRegexp= function($el,errorMes){
		var that = this;
		var $elVal = $el.val()
		if($el.attr('data-regexp') == $el.attr('name')){
			if(!$elVal.match(this.opts.regexp[$el.attr('name')])){
				return that.errorMes($el,errorMes);
			}
			if(typeof($el.attr('maxlength')) != 'undefined' && $elVal.length != $el.attr('maxlength')){
				return that.errorMes($el,errorMes);
			}
		}
		return true;
	}
	//ajax
	checkForm.prototype.ajaxFetch = function(url,params,callback){
		$.ajax({
            url: url,
            data: params,
            type: "POST",
            dataType: "json",
            success: callback
        });
	}
	checkForm.prototype.checkboxCheck = function(){
		var that = this;
		var domEl = $('input[type="checkbox"]:required');
		$.each(domEl, function(index, el) {
			var $el = $(el);
			$el.on('change',function(){
				var $this = $(this);
				if($this.is(':checked')){
					$this.attr('data-pass',"pass");
				}else{
					$this.removeAttr('data-pass');
				}
				that.passStyleCss();
			});
		});
	}
	//按钮样式
	checkForm.prototype.passStyleCss = function(){
		var formBtn = $('.form-btn button');
		$.each($('input:required'), function(index, el) {
			var $el = $(el);
			if(typeof($el.attr('data-pass')) != 'undefined'){
				formBtn.removeAttr('disabled').addClass('cur');
			}else{
				formBtn.attr('disabled','disabled').removeClass('cur');
				return false;
			}
		});
	}
	checkForm.prototype.init = function(){
		this.bindEvent();
		this.checkboxCheck();
	}
	new checkForm({
		dataRemote: {
			name:{
				url: 'assets/js/test.json',
				data: {
					action: 'checked'
				},
				callback: function(data,$el,successTip,errorTip){
		        	var dataCode = data.code;
		        	if(dataCode == 0){
		        		successTip && successTip();
					}else if(dataCode == 1){
						errorTip && errorTip('亲，您的笔名过于敏感，换一个吧');
					}else if(dataCode == 2){
						errorTip && errorTip('亲，笔名已被占用，换一个吧');
					}
				}
			},
			qq: {
				url: '../assets/js/test.json',
				data: {
					action: 'submit'
				},
				callback: function(data,$el){
				}
			}
		}
	})