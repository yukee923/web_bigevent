$(function() {
    // 点击“去注册账号”的链接
    $('#link_reg').on('click', function() {
        $('.login-box').hide();
        $('.reg-box').show();
    });
    // 点击“去登录”的链接
    $('.link_login').on('click', function() {
        $('.login-box').show();
        $('.reg-box').hide();
    });
    //从 layui 中获取 form 对象
    var form = layui.form
    var layer = layui.layer
    form.verify({
        // 自定义了一个叫做 pwd 校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        repwd: function(value) {
            var pwd = $(".reg-box [name=password]").val();
            if (pwd !== value) {
                return "两次密码不一致"
            }
        }
    });

    //发起注册用户的Ajax请求
    $("#form_reg").submit(function(e) {
        e.preventDefault();
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        $.ajax({
            method: 'post',
            url: '/api/reguser',
            data: data,
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                layer.msg("注册成功");
                $('.link_login').click();
            }
        })
    });

    //发起登录的Ajax请求
    $("#form_login").on('submit', function(e) {
        e.preventDefault();
        $.post('/api/login', $(this).serialize(), function(res) {
            if (res.status != 0) {
                return layer.msg("登录失败");
            }
            layer.msg("登录成功");
            // 将登录成功得到的 token 字符串，保存到 localStorage 中
            localStorage.setItem("token", res.token);
            //跳转到后台主页
            location.href = 'index.html';
        })
    });
})