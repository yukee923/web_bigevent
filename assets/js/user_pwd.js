$(function() {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        samePwd: function(value) {
            if (value === $(".layui-form-item .oldPwd").val()) {
                return "新密码和旧密码不能一样!";
            }
        },
        rePwd: function(value) {
            if (value !== $(".layui-form-item .newPwd").val()) {
                return "两次输入的密码不一致!";
            }
        }
    })

    $(".layui-form").on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("修改密码失败!");
                }
                layer.msg("修改密码成功!");
                // 重置表单 reset 是原生dom方法 需要吧jQuery对象转换为dom对象
                $(".layui-form")[0].reset();
            }
        })
    })
})