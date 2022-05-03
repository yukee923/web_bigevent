$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }
    initTable();
    initCate();

    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章列表失败！");
                }
                var strHtml = template('tpl-table', res);
                $('tbody').html(strHtml);
                // 调用渲染分页的方法
                renderPage(res.total);
            }
        })
    }

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg("获取文章类别失败!")
                }
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 通过 layui 重新渲染表单区域的UI结构
                form.render();
            }
        })
    }
    // 为筛选表单绑定 submit 事件
    $("#form-search").on('submit', function(e) {
        e.preventDefault();
        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        q.cate_id = cate_id;
        q.state = state;
        initTable();
    })

    // 通过代理的形式，为删除按钮绑定点击事件处理函数
    $("tbody").on('click', '.btn-delete', function() {
        // 获取删除按钮的个数
        var len = $('.btn-delete').length;
        var id = $(this).attr("data-id");
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status != 0) {
                        return layer.msg("删除失败")
                    }
                    layer.msg('删除文章成功！');
                    // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                    // 如果没有剩余的数据了,则让页码值 -1 之后,
                    // 再重新调用 initTable 方法
                    if (len == 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            })
            layer.close(index);
        })
    })

    //定义渲染分页方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示几条
            curr: q.pagenum, //默认选中第几页的数据
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function(obj, first) {
                //obj包含了当前分页的所有参数，比如：
                //console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                //console.log(obj.limit); //得到每页显示的条数
                // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr;
                // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                q.pagesize = obj.limit;
                //首次不执行
                if (!first) {
                    //重新渲染表格
                    initTable();
                }
            }
        });
    }

    //编辑文章
})