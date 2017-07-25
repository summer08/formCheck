# 常用form表单验证
1、如果表单选项是必填项，直接在input中添加“required”属性，代码如下图：
``` 
<input type="text" placeholder="必填（不得抄袭，涉黄，涉政)"  name="name" required />
``` 

2、选项验证提示空消息和错误消息，在input中增加“data-empty”和“data-error”属性，代码如下图：
```
<input type="text" placeholder="必填（不得抄袭，涉黄，涉政)"  name="name" data-empty='亲，笔名不能为空哦' data-error="亲，格式有误请正确填写哦">
```

3、选项验证如果有与后台交互的，需要在input中增加“data-ajax”属性，并且属性值要与name属性值一样，代码如下图：
```
<input type="text" placeholder="必填（不得抄袭，涉黄，涉政)"  name="name"  data-ajax="name">
```

4、选项如果有正则验证，需要在input中增加“data-regexp”属性，并且属性值要与name属性值一样，代码如下图：
```
<input type="text" placeholder="必填" name="tel" data-regexp="tel">
```

5、选项如果有最大长度验证，则需要在input中增加“maxlength”属性，代码如下图：
```
<input type="text" placeholder="必填" name="tel" maxlength="11" data-regexp="tel">
```

6、最后需要注意的是如果选项有异步接口的验证，在实例化对象的时候要对接口进行处理，代码如下：
```
new checkForm({
  dataRemote: { //接口字段
    name:{ //与input中“data-ajax”这个属性值一致
      url: '../assets/js/test.json', //接口请求地址
      data: { //接口传参
        action: 'checked'
      },
      //接口回调函数
      callback: function(data,$el,successTip,errorTip){
      //回调函数传参
      /*
      data:接口返回值
      $el:当前操作的input元素
      successTip：对接口返回成功的处理
      errorTip：对接口返回失败的处理
      */
        var dataCode = data.code;
        if(dataCode == 0){
          successTip && successTip();
        }else if(dataCode == 1){
          errorTip && errorTip('亲，您的笔名过于敏感，换一个吧');
        }else if(dataCode == 2){
          errorTip && errorTip('亲，笔名已被占用，换一个吧');
        }
      }
    }
})
   
