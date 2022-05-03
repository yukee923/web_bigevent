$(function() {
    initArtCateList();
    var layer = layui.layer;
    var form = layui.form;
    var indexAdd = null;
    var indexEdit = null;
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    //添加分类
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg("添加分类失败!")
                }
                initArtCateList();
                layer.msg('新增分类成功');
                // 根据索引，关闭对应的弹出层
                layer.close(indexAdd);
            }
        })
    })

    //修改分类
    $("tbody").on("click", ".btn-edit", function() {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        var id = $(this).attr("data-id");
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val('form-edit', res.data);
                console.log(res.data);
            }
        })
    })

    // 通过代理的形式，为修改分类的表单绑定 submit 事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功！')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    //删除文章分类
    $("tbody").on("click", ".btn-delete", function() {
        var id = $(this).attr("data-id");
        layer.confirm('确定要删除吗?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status != 0) {
                        return layer.msg("删除分类失败!");
                    }
                    layer.msg("删除分类成功");
                    layer.close(index);
                    initArtCateList();
                }
            })

        })
    })
})

//初始化文章分类列表
function initArtCateList() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg("获取文章分类失败!");
            } else {
                var htmlStr = template('tpl-table', res);
                $(".layui-table tbody").html(htmlStr);
            }
        }
    })
}