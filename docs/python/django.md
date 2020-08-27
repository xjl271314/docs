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


