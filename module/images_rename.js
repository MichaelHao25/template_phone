const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sizeOf = require('image-size');
// const {
// 	spawn
// } = require('child_process');
const iconv = require('iconv-lite');
const poste = require('copy-paste')

var count = 0;
function f_main(dirname) {
	const fileDirectory = dirname
	console.log(fileDirectory);
	
	fs.watch(fileDirectory + '/img', function (eventType, filename) {
		console.log(eventType + '+' + filename)
		if (filename.search(/(BMP|CUR|GIF|ICO|JPG|PNG|PSD|TIFF|WebP|SVG|DDS)$/i) == -1) return;
		// // 判断图片类型
		if (eventType == 'rename' && filename.search(/.*?_tmp\d+/) == -1 && !filename.match(/^\w{5}_\d{1,}_\d{1,}_\d{1,}\.\w{1,5}$/)) {
			//处理Photoshop出来的临时文件
			//修复mac下的饿change事件没有被正常的创建

			var i_path = '';
			// 2018年5月17日14点24分
			i_path = path.parse(fileDirectory + '/img/' + filename);
			setTimeout(() => {
				f_get_hash(i_path)
			}, 200);
			// 2018年5月17日14点24分使用函数处理
		}
	})
}

function f_rename(j_parameters, fun) {
	fs.open(j_parameters.dir + '/' + j_parameters.hash + j_parameters.ext, 'r', (err, fd) => {
		//尝试打开改名后的文件如果打开的则此当前处理的文件已经重复然后删除这个新的文件
		//并不是覆盖这个文件
		//以提升硬盘寿命
		// 2018年5月17日14点24分
		//提交多次判断。如果文件新的名字和先有的名字一样的话则不进行处理。。。
		//2018年6月3日15点58分
		// fixbugs
		//windows更新问题修复。
		//watch触发事件没有按照预期的触发进行补丁

		if (j_parameters.base != j_parameters.hash + j_parameters.ext) {
			if (err) {
				fs.rename(j_parameters.dir + '/' + j_parameters.base, j_parameters.dir + '/' + j_parameters.hash + j_parameters.ext, function (error) {
					if (error) {
						console.log(error);
						return;
					}
				})
			} else {
				f_delete_file(j_parameters.dir + '/' + j_parameters.base);
			}
			//设置剪切板
			// exec('cat').stdin.end(iconv.encode('img/' + j_parameters.hash + j_parameters.ext, 'gbk'));
			// var proc = spawn('pbcopy')
			console.log(111);
			// proc.stdin.write(iconv.encode('img/' + j_parameters.hash + j_parameters.ext, 'utf-8'));
			// proc.stdin.end();
			poste.copy('img/' + j_parameters.hash + j_parameters.ext);
			console.log(j_parameters)
			console.log('images_info:在上面！！！！！！');
			console.log('finish!')
		}
	});
	// 判断文件是否存在存在则删除这个文件不存在则该名称

}

function f_delete_file(s_url) {
	fs.unlink(s_url, function () {
		console.log('unlink finish！')
	})
}

function f_get_hash(j_parameters, fun) {
	var i_response = fs.createReadStream(j_parameters.dir + '/' + j_parameters.base);
	var i_md5 = crypto.createHash('md5');

	i_response.on('data', i_md5.update.bind(i_md5));

	i_response.on('end', function () {
		var i_hash = i_md5.digest('hex');


		var a_image_size = sizeOf(j_parameters.dir + '/' + j_parameters.base);

		j_parameters.hash = i_hash.substring(0, 5) + '_' + count + '_' + a_image_size.width + '_' + a_image_size.height;
		count++;
		// if (j_parameters.name == j_parameters.hash) return;
		// 文件名如果就是处理过的就不进行处理
		//issus 上述判断永远不会生效已经在后面代码修复

		f_rename(j_parameters, fun);
		// ,function() {
		// 	i_last_name = '';
		// }
	});

	i_response.on('error', function (error) {
		// 处理例外情况文件不存在的时候进行
		console.log(error)
		i_response.close();
		return;
	})
}

// f_main('/Users/blue/htmlRoot/html/12-17')
module.exports = f_main;



// 2018年5月17日14点24分
// 提高性能优化
// 修改文件名在同名的时候不是改名覆盖而是提升磁盘寿命
// 修复bug如果两次的文件名称是一样的话则改名失败。。
