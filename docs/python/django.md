# Django的介绍与使用


## 模型的数据字段

- 2020.08.26

> 在Django中提供了一共27种常用的基本数据字段类型,包括了以下几种类型。

- 数值类字段
- 字符类字段
- 布尔类字段
- 日期时间类字段
- 文件类字段
- IP地址类字段
- 二进制类字段


### 数值类字段

> 数值类字段主要包括9个类型。

#### 1. `AutoField` 和 `BigAutoField`

在`django`中如果没有给模型指定一个主键的话,会自动给模型添加一个`AutoField`字段,他是一个根据`可用ID`自动添加的整数类型字段。

`BigAutoField`与`AutoField`类似,不过是一个64位的整数类型的字段。如果预计将来这个模型的记录会非常的多,可用使用这个字段。

#### 2. `IntegerField`

`IntegerField`是一个非常常用的数据类型字段,代表一个32位的整数,取值范围为 `-2147483648 ~ 2147483647`。从这个字段派生出其他4个类型的字段。

`PositiveIntegerField`为非负整数类型的字段,取值为 `0 ~ 2147483647`。

`SmallIntegerField`为小整数类型,代表一个16位的整数类型,取值为 `-32768 ~ 32767`。

`PositiveSmallIntegerField`为非负整数的小整数类型,取值为 `0 ~ 32767`。

`BigIntegerField`为大整数类型的字段,它是一个64位的整数类型的字段,取值范围为 `-2^63 ~ 2^63`。

#### 3. `FloatField`

`FloatField`为浮点数类型的字段,用于存储一个实数,代表`Python`中的`Float类型`的实例。

#### 4. `DecimalField`

`DecimalField`为十进制类型的字段,代表一个固定精度的十进制数,代表`Python`中`Decimal`模块中`Decimal对象`的实例。

### 字符类字段

> 字符类字段主要涉及到7个类型。

#### 1. `CharField`

`CharField`为字符类型的字段,用于存储字符串类型的数据,有一个必须的字段属性为`max_length`,用于说明该字段所需存储的字符串额字符长度,其派生出3个类似的字段。

`EmailField`为电子邮箱的字段,在字符字段的基础上增加了Email格式验证。

`SlugField`为标签字段,仅含有字母、数字、下划线、连字符,常用于URL中。

`UrlField`为URL字段,默认字符长度为200字符。

#### 2. `FilePathField`

`FilePathField`为文件路径字段,用于存储文件路径,可被限制在当前文件系统上某一特定目录中的文件上。其path参数为必选参数,指定文件路径字段选择文件名的目录的绝对路径。接收一个字符串类型的可选参数match,该字段可以是一个正则表达式,用于筛选文件名。

#### 3. `TextField`

`TextField`为文本字段,用于存储大量的文本,无需指定最大长度。

#### 4. `UUIDField`

`UUIDField`为UUID字段,用于存储UUID字段,在数据库中通常使用char(32)来进行存储。

### 布尔类字段

> 布尔类字段主要涉及2个类型。

#### 1. `BooleanField`

`BooleanField`为布尔字段,只有 Ture 和 False 两个值。如果没有置顶default参数时,该字段的默认值为None。

#### 2. `NullBooleanField`

`BooleanField`为可空布尔字段,在布尔字段基础上增加了null选项。

### 日期时间类字段

> 日期时间类字段主要涉及4个类型。

#### 1. `DateField`

`DateField`为日期字段,用于存储日期数据,代表python中的datetime.date类的实例,有两个可选的参数为 `auto_now` 和 `auto_now_add`,均为布尔类型参数。

当`auto_now`设置为True时,每当该模型的实例调用save方法进行保存时,都会自动更新这个字段的值,常用于记录最后的修改时间。

`auto_now_add`则是在改模型的实例第一次创建时,自动将该字段的值设置为当前的时间,常用于记录创建的时间,后期对于这个值的修改都会被忽略。

:::warning
这两个可选参数是互斥的,如果同时设置为True,则会引发异常,记录创建时间和修改时间通常是使用连个字段来分别记录的。
:::

#### 2. `DateTimeField`

`DateTimeField`为日期时间字段,派生于日期字段,代表Python中datetime.datetime类的实例,与DataField的可选参数一样。


#### 3. `TimeField`

`TimeField`为时间字段,代表Python中datetime.time类的实例,与DataField的可选参数一样。

#### 2. `DurationField`

`DurationField`为时间段字段,用于存储时间段信息,代表Python中的timedelta,通常在数据库层使用bigint类型来存储毫秒信息。

### 文件类字段

> 文件类字段主要涉及2个类型。

#### 1. `FileField`

`FileField`为文件字段,用于处理文件上传的字段,不可以作为该模型的主键。该字段有2个可选的参数 `upload_to` 和 `storage` 需要特殊说明一下。

1. `upload_to`用于指定文件的上传路径。可接收两种形式的参数。

- 符合strftime函数的字符串,在文件保存时替换为相对应的时期或者时间格式。

- Django中有实现不同的文件存储方式(使用不同的存储引擎),比如保存在服务器本地、FTP、第三方服务商提供的文件存储器等。

如果使用的是 `Django` 中的 `FileSystemStorage` 的话,文件将会保存在 `MEDIA_ROOT` 路径下的 `upload_to` 路径下,`upload_to`这个参数可以是一个具体的值,也可以是一个生成保存路径的函数。

该函数接收两个参数,第一个参数调用 save方法的实例,即该模型的实例;第二个参数为文件名。改函数用于返回一个Unix模式的路径名给存储引擎。

2. `storage参数`用于指定使用的存储引擎,用来实际存储和读取文件。

在Django中,对上传文件的处理方式通常不会直接存储如数据库,而是根据存储引擎的规则,将文件存储在文件系统中,并将文件的存储路径存入数据库。

在这种情况下,存储引擎会根据所调用的 storage 的 url 方法来生成该文件的URL地址,以供模板使用。

:::tip
如果要编写自己的storage类,就要注意url方法的编写。
:::

#### 2. `ImageField`

`ImageField`字段为图片字段,完全继承于 `FileField`,在此基础上添加了图片验证,会校验上传的文件对象是否为图片。与`FileField`相比,添加了`height_field` 和 `width_field` 两个可选参数,这两个参数接收模型中用于存储图片高和宽信息的字段名称。每当对该对象调用save方法保存时,会自动更新对应字段的值(需要Pillow模块支持)。

### IP地址类字段

> 这种类型的字段仅用来存储IP地址相关的信息。

#### `GenericIPAddressField`

`GenericIPAddressField`用于存储一个IPV4地址或者IPV6地址,会校验输入信息的有效性。

### 二进制类字段

> 一般情况下不会存储二进制文件到数据库,但是django还是保留了这样的字段。

#### `BinaryField`

`BinaryField`为二进制字段,用于保存原生的二进制数据,只能通过字节访问,同时其他查询功能也都受到了限制。

## 模型关系字段

- 2020.08.26

### 外键字段

> 外键代表着数据库中的一对多的关系。

`ForeignKey`字段在使用时有两个必选参数: 第一个参数是与之关联的模型的名称,第二个是`on_delete`字段,用于指明当关联的对象被删除时该对象的行为。

### 多对多字段

> 多对多字段用于处理两个模型之间多对多的关系。与外键类似,有一个必选参数为与之关联的模型的名称。

:::tip
在使用多对多字段时,如果两个关联关系之间存在较为复杂的关系,则可以通过 `through_fields` 参数来自定义中间模型。
:::

例如在大学选课的时候,一个学生可以选择多门的课程,一门课程也可以被多个学生选择,对于这类的场景我们就可以通过一个自定义的中间模型来表示:

```py
from django.db import models

class Student(models.Model):
    name = models.charField(max_length = 16)

class Courses(models.Model):
    name = models.charField(max_length = 16)
    student = models.ManyToManyField(
        Student,
        through = 'Relationship', # 指明通过哪一个模型进行关联
        through_fields = ('course', 'student') # 关联字段的名称,注意这是一个元组。元组的第一个元素是当前模型对于的字段
    )

class Relationship(models.Model):
    student = models.ForeignKey(Student, on_delete = models.CASCADE)
    course = models.ForeignKey(Course, on_delete = models.CASCADE)
    course_type = models.charField(max_length = 16)
```

### 一对一字段

> 一对一字段与外键字段极其相似,不同之处在于一对一字段模型对象之间是一一对应不可重复的。在使用关联字段进行反查时,将之间返回单个对象,而不像外键那样返回一个关联对象的集合。


## 字段参数

- 2020.08.27

| 参数名称  | 描述
| :--- | :----
| `null` | 如果将这个参数设置为`True`,那么向数据库保存这个对象时,如果这个字段的值是空值的话,数据库中将会保存为`NULL`。对于字符串字段应当尽量可能避免这个参数设置为`True`。
| `blank` | 如果将这个参数设置为`True`,那么在保存数据时这个字段对应的输入框可以留空。
| `choices` | 这个参数可以接受一个元组或者列表作为该字段可选值的列表。这个元组或者列表中的每一个元素必须为一个二元组。二元组的第一个值将作为这个字段的值被保存在数据库中,而第二个值是一个可读性较强的值用于显示,两个值可以保持一致。
| `db_column` | 用于指定改字段在数据库表中的名称,如果没有指定,则会通过`field字段`名称生成一个默认的名称。
| `db_index` | 如果设置为`True`,那么将会在这个字段上创建数据库索引。通常通过添加索引可以提高检索速度,但数据库索引并非越多越好,因为数据的增加、删除、修改会导致数据库索引的更新,从而造成额外的性能开销，
| `default` | 为该字段设置默认值,也可以是一个生成默认值的函数。如果是一个函数的话,那么每次创建新对象的时候都会调用该参数。
| `primary_key` | 如果设置为`True`,这个字段将会被指定为当前模型的主键。作为主键的字段不能为`NULL`,也不能为空。同时该字段也将变为只读字段,如果该模型未设置 `primary_key` 的话,`django` 会设置一个默认的自动增加的主键字段。
| `unique` | 如果设置为`True`,则会在数据表中保持该字段的唯一性,数据库会添加唯一的索引。如果保存一个该值重复出现的模型,系统将会抛出异常。在设置了`unique` 为`True`的时候就无须再次设置 `db_index` 参数。
| `verbose_name` | 为字段提供一个可读性良好的字段名称,比如在`Django Admin`操作界面上显示更易懂的文字。

## 数据库查询接口简介

- 2020.08.27

> django给我们提供了一个shell脚本,无需界面即可操作数据的增加、删除、修改等功能。

### 创建对象

> 在django中,为了将数据与数据库中的数据对应起来,使用模型类来表示数据表,用这个模型类的实例来代表数据表中的一条数据。所以在创建一个数据表的记录的时候,只需要创建一个该数据模型的实例并调用其save方法即可。

:::tip
只有当save方法被执行时才会执行真正的数据库INSERT操作。
:::

```py
book = Book(name='深入理解计算机系统', author='xjl271314', price='99.00', publish_date='2020-08-27', category='计算机与互联网')

book.save()
```

### 修改对象

> 如果要修改一个已经存在的对象,只需要修改对应的属性之后再次调用save方法即可。

```py
book.price = 111.2

book.save()
```

:::tip
在django中除了对单个对象的修改之外,还支持对批量对象进行修改,这时只需要调用QuerySet对象的update方法即可。
:::

```py
Book.objects.filter(category='计算机与互联网').update(category='计算机')
```

### 查找对象

> Django在查找方面也提供了非常丰富的接口。我们需要通过模型类上的Manager来构建QuerySet从数据库中取回所需的对象。QuerySet对象代表着数据库中的一些记录的集合,接受任意多个筛选条件,最后根据查询参数生成一个SQL的SELECT语句并执行。

:::tip
Django会把查询结果以`QuerySet对象`的形式返回。每个模型类都有一个叫做`objects`的默认`Manager`, `Model.objects`是`models.Manager`的实例,这个实例的大部分方法都是返回一个`QuerySet对象`。也可以根据需要自定义`Manager类`。
:::

- **如果希望取回一个模型下的所有对象,就可以通过`Manager`的`all`方法取回。**

```py
book_set = Book.objects.all()
```

- **如果希望按照一定的筛选条件筛选出想要的部分记录,可以调用filter方法或者exclude方法。**

    - `filter`方法会返回一个新的`QuerySet对象`,即符合给定的查询条件;

    - 而`exclude`方法则相反m返回一个新的QuerySet对象时排除了指定的查询条件后的记录。

:::tip
在django中QuerySet返回的仍然是一个QuerySet对象,所以可以链式调用。
:::

```py
bppk_set = Book.objects.filter(category='计算机与互联网').filter(publish_date__year = 2020)
```

:::tip
在这样的使用情况下,得到的总是一个QuerySet对象。如果想要获得单个元素可以调用get方法。
:::

```py
book = Book.objects.get(pk = 1)
```

:::warning
需要注意的是,如果使用get方法取回元素时满足的条件不是唯一的话或者不存在,均会抛出异常。
:::

:::tip
我们可以在查询的时候对 `QuerySet` 进行数组切片来返回我们需要的数量。这样的语法在数据库中对应为 `LIMIT` 和 `OFFSET` 限定词。另外,查询时不支持负数索引。
:::

```py
book_set = Book.objects.filter(publish_date__year = 2020)[:10]
```

在传递参数查询的时候,有两种可选的方式。

- 一种是使用"字段名=值"的方式,
- 另一种是"字段名_——查询方式=值"。比如上面的查询方式就是使用了后者。

可选的查询方式还有很多,比如`exact`为精确匹配,`iexact`为无视字母大小写的精确匹配;`contains`为包含;还有`startswith`、`endwith`等。

### 删除对象

> `Django`同样提供了方便简洁的删除接口。可以直接对模型类的实例调用它的`delete`方法来执行删除操作,也可以对一个`QuerySet`调用`delete`方法来进行批量的删除操作。

```py
book = Book.objects.get(pk=1)

book.delete()

Book.objects.filter(publish_date__year=2020).delete()
```

## Django中页面的实现

- 2020.08.28

> 在`django`中实现页面有两个部分需要完成,首先是一个模板文件,也就是一个`html`文件,他是整个页面的结构;另一个是`views.py`文件,在其中完成对应的视图处理函数。

### 如何处理静态文件

> 和其他框架一样,Django框架在实际生成环境中试不处理静态文件这部分的。一般而言静态文件都是交由HTTP服务器类似Apache或者Nginx,这样可以更高效和灵活。开发环境中,django给我们提供了一个精简的开发测试用的HTTP服务器。

在django中使用静态文件,只需要简单的几个步骤。

1. 首先在需要使用静态文件的模板页面首行插入 `{% load static %}`语句,告诉django的模板引擎,需要在这个文件中载入静态文件。

2. 在需要使用静态文件的地方使用 static 标签加上文件对应应用的静态目录的相对路径地址即可。

```py
{% load static %}
...

```

:::warning

在django 2.x版本中此处为 `{% load staticfiles %}`

:::


## Django通用视图简介

- 2020.08.30

### TemplateView简介

> `TemplateView`是一个最为基本的通用视图,它的作用是渲染指定的模板。

在使用`TemplateView`的时候,通过继承`TemplateView`类并把它的 `template_name`属性指定为模板名称即可。

:::tip
如果需要在模板渲染时传入额外的参数,可以通过重写 `get_context_data` 方法来实现。
:::

```py
class HomepageView(TemplateView):

template_name = 'website/index.html'

def get_context_data(self, **kwargs):
    context = super().get_context_data(**kwargs)
    context['username'] = 'admin'
    return context
```


### RedirectView简介

> 跳转视图的作用是跳转到指定的 URL 对应的网页,可以通过几种不同的方式提供想要跳转网页对应的URL。

1. 重新设置RedirectView的URL属性,以字符串的形式提供一个URL,Django将会自动跳转到这个URL对应的网页。

2. 重新设置path_name属性,提供一个在URL设置中的URL名称,Django框架会找到这个名称对应的URL地址并跳转到对应的网页。

:::tip
如果上面两种方式都不能满足应用的需求,那么可以采用重写 `get_redirect_url`方法的方式,通过这个方法返回一个URL字符串。

在跳转之前我们也可以先实现自己所需要的逻辑,然后执行跳转。
:::

```py
class LogoutView(RedirectView):
    pattern_name = 'homepage'

    def get_redirect_url(self, *args, **kwargs):
        logout(self.request)
        return super(LogoutView, self).get_redirect_url(*args, **kwargs)
```

### DetailView简介

> `DetailView`多用于展示某一个数据对象的详细信息的页面。通常情况下,通过在URL中提供一个 `pk` 或者 `slug` 参数,`Django`就会根据所提供的这个参数来找到指定模型的对象,并渲染出指定模板的页面。

通过重新设置model属性来指定需要获取的Model类,默认对象名称为`object`,也可以通过重写设置 `context_object_name` 属性来更改这个名字。

当然,也可以通过直接重写 `get_object` 方法来实现更加复杂的逻辑m或者在取回对象的同时完成一些附加逻辑。

```py
class BookDetailView(FrontMixin, DetailView):
    model = Blog
    context_object_name = 'article'
    template_name = 'article/article_detail.html'

    def get_object(self, queryset = None):
        obj = super(BookDetailView, self).get_object()
        obj.show_times += 1
        obj.save()
        return obj
```

### ListView简介

> `ListView`主要用于展示对象的列表,可以通过重写设置其model字段来指定想要展示的类型,可以在模板用 `object_list` 来调用对象的列表。默认情况下,获取的是该模型的全部元素,即调用了 `all` 接口。

`ListView`可以使用Django内置的分页组件,只需要重写设置 `paginate_by` 字段,指定分页的大小即可。

当然如果想对列表进行一些筛选或者自定义查询的规则,也是非常容易的,只需要重写 `get_queryset`方法即可。该方法返回一个QuerySet对象。

如果需要向页面中添加其他元素,和 `TemplateView` 类似,只需要重写 `get_context_data`方法,在其中加入所需要的额外信息即可。

### FromView简介 

> `FromView`主要用于表单的处理,通过Get方式访问该视图时会返回表单。通过POST方式提交表单后,如果出现错误,会返回相应的错误信息,如果没有错误信息则会跳转至新的URL对应的网页。

使用`FromView`除了像以往一样通过重新设置 `template_name` 来指明模板之外的,还必须通过重新设置 `from_class` 字段来指定需要处理的表单对象,并且通过重设 `success_url` 来指定表单处理成功会的跳转路径。

### CreateView简介

> `CreateView`是较为常用的通用视图,可以将创建对象这样简单重复的程序逻辑全部交由这个通用视图来处理。我们需要做的仅仅是重新设置 `model` 字段来指明所需要创建对象的模型,并且通过重设 `fields` 字段来指明表单中会提交的字段名称,剩下的交给 Django处理。

### UpdateView简介

> `UpdateView` 和 `CreateView`基本上是一致的,区别在于前者是对一个已经存在的对象进行显示和修改。

在使用方法上,`UpdateView` 和 `CreateView`一样,需要传入一个具体的pk或者slug找到需要修改的对象。同时与 `CreateView`类似,需要通过重写设置 `fields` 字段来指定所要更新的字段名称。如果修改成功,会跳转到重设 `success_url`字段指定的网页。

### DeleteView简介

> `DeleteView`用于删除一个对象和展示确认页面的视图。

- 当以GET方式访问时会展示确认页面,这个页面应该包含一个含有像同一个URL提交POST请求的表单。

- 通过POST访问这个URL时,会删除指定的对象。

## Django编写RESTFUL API(教程)

- 2020.09.07

> 本章节旨在通过示例指导如何从0开始开发一套django的后端API服务(不涉及使用相应的template模板进行搭建视图),完成前后端的解耦。

### 准备工作

在我们开始之前,先做一些准备工作,熟悉的小伙伴可以跳过。

1. 安装Django
2. 新建Django项目
3. 对一个简单的HttpRequest做出响应
4. 解析带参数的URL
5. 处理HTTP请求的body

#### 1.安装django

```py
pip3 install Django

# 如果需要指定版本可以跟上对应版本号
pip3 install Django==3.1
```

#### 2. 新建Django项目

```py
django-admin startproject restful_api
```

在这里我们新建了一个名为 `restful_api` 的项目,目录结构如下:

- `restful_api` 项目文件夹
    - `manage.py` 用来运行Django项目的一些功能
    - `restful_api` 
        - `__init__.py`: 一个空文件，告诉 `Python` 这个目录应该被认为是一个 `Python` 包。一般，你不需要去修改它。
        - `asgi.py`: 与ASGI兼容的Web服务器为您的项目提供服务的入口点。有关更多详细信息，请参见如何使用ASGI进行部署。
        - `settings.py`: 配置文件。
        - `urls.py`: 路由文件。
        - `wsgi.py`: 作为项目的运行在 WSGI 兼容的 Web 服务器的入口。

### 运行项目

执行以下命令,打开 localhost:8888 就会看到django为我们生产的默认的启动页。
```py
cd 主项目
python manage.py runserver 8888
```

![默认项目](https://img-blog.csdnimg.cn/2020090811294538.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70#pic_center)

### 3. 对一个简单的HttpRequest做出响应

> Django中的 `views.py` 存放着对应的视图解析函数(类)等, `urls.py` 存放对应的url与解析的映射。

1. 在 `views.py` 中新增一个方法

```py
from django.http import JsonResponse

def test_function(request):
    return JsonResponse({
        code: 0,
        msg: 'success',
        data: "Hello World"
    })
```

2. 在 `urls.py` 中新增一个映射

```py
# task_platform/urls.py
from django.contrib import admin
from django.urls import path
from restful_api import views # added

urlpatterns = [
    path('admin/', admin.site.urls),
    path('test/', views.test_function), # added
]
```

这样我们访问 `localhost:8888/test` 就会输出对应的结果了。

```json
{"code": 0, "msg": "success", "data": "Hello World"}
```

### 4. 解析带参数的URL

如何解析url上携带的参数 类似 `http://localhost:8888/test?user=Lucy&gender=femail`?

```py
# 修改后的方法
from django.http import JsonResponse

def test_function(request):
    user = request.GET['user']
    gender = ('先生','女士')[request.GET['gender'] == 'femail']
    return JsonResponse({
        'code': 0,
        'msg': 'success',
        'data': "欢迎回家 {0} {1}".format(user, gender)
    })
```

### 5. 解析HTTP请求的body

在 `views.py` 中新增一个`post`方法。

```py
from django.views.decorators.csrf import csrf_exempt

# 用于不进行验证csrf cookie 否则会报错
@csrf_exempt
def test_post_function(request):
    user = request.POST['user']
    gender = ('先生','女士')[request.POST['gender'] == 'femail']
    print("欢迎回家 {0}~{1}".format(user, gender))
    return JsonResponse({
        'code': 0,
        'msg': 'success',
        'data': "欢迎回家~{0} {1}".format(user, gender)
    })
```

使用 `postman` 进行请求模拟。

![postman](https://img-blog.csdnimg.cn/20200909200244660.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70#pic_center)

### 最简单的请求例子

```py
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def test_add_api(request):
    '''
        实现两数的和
    '''
    received_data = json.loads(request.body.decode('utf-8'))
    var1 = received_data['var1']
    var2 = received_data['var2']

    sum = var1 + var2

    return JsonResponse({
        'code': 0,
        'msg': 'success',
        'data': sum
    })
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200909201544643.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70#pic_center)

## Django中mysql数据库的配置

在`django`中默认的数据库是`sqlite3`,配置在`settings.py`中。

```py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}
```

如果需要修改为`mysql`,需要安装对应的数据库包`pymysql`,并在项目的`__init__.py`中引入,将其设置为默认数据库。


```py
# setteings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': '数据库名称',
        'HOST':'localhost',
        'PORT':3306,
        'USER':'用户名',
        'PASSWORD':'密码'
    }
}

# __init__.py
import pymysql

# 这里如果遇到报错 可以采用使用指定版本的mysql进行解决。
pymysql.version_info = (1, 4, 13, "final", 0)
pymysql.install_as_MySQLdb()

```



## Django部署相关知识

- 2020.09.07

本文主要讲解在`Linux`下使用`Nginx` 和 `uWSGI`来部署 `Django` 项目。

整个的部署链路是 `Nginx ————> uWSGI ————> Python Web 应用`,通常还会用到 `supervisor` 工具。

### uWSGI

> uWSGI是一款软件,即部署服务的工具。

### WSGI

> WSGI(Web server Gateway interface)是一个规范,它规定了Python Web应用和Python Web服务之间的通信方式。

### uwsgi

> uwsgi协议是uWSGI独有的协议,具有简洁高效的特点。有关uwsgi协议的细节,可以参考 [uWSGI的文档](https://uwsgi-docs.readthedocs.io/en/latest/Protocol.html)

### Nginx

> Nginx是一个Web服务器,是一个常用的反向代理工具,通常用它来部署静态文件。uWSGI通过WSGI规范和Python Web服务进行通信,然后通过自带的uwsgi协议和Nginx进行通信,最终 Nginx 通过HTTP协议将服务对外公示。

Nginx中有一个 `ngx_http_uwsgi_module` 模块,当一个访问到达 Nginx时, Nginx会把请求(HTTP协议)转化为 uwsgi协议。

