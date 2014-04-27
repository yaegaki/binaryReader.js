var binaryReader = (function(){
	function binaryReader(uint8array, endian){
		this.endian = endian ? (endian === 'big' ? 'big' : 'little') : 'little';
		this.position = 0;
		this.data = uint8array;
	}
	
	
	function readAsciiString(length){
		if(this.data.length < this.position + length){
			throw 'range error';
		}
		var str = '';
		for(var i = 0;i < length;i++){
			str += String.fromCharCode(this.data[this.position+i]);
		}
		this.position += length;
		return str;
	}
	
	function readBytes(length){
		if(this.data.length < this.position + length){
			throw 'range error';
		}
		
		var buf = new Uint8Array(length);
		for(var i = 0;i < length;i++){
			buf[i] = this.data[this.position + i];
		}
		
		this.position += length;
		return buf;
	}
	
	function readUint8(){
		if(this.data.length < this.position + 1){
			throw 'range error';
		}
		var result;
		
		result = this.data[this.position];
		
		this.position += 1;
		return result;
	}
	
	function readInt8(){
		var result = this.readUint8();
		
		if(result & 0x80){
			result = -((result - 1) ^ 0xff);
		}
		
		return result;
	}
	
	function readUint16(){
		if(this.data.length < this.position + 2){
			throw 'range error';
		}
		
		var result;
		
		if(this.endian === 'little'){
			result = this.data[this.position] + (this.data[this.position+1] << 8);
		}else{
			result = this.data[this.position+1] + (this.data[this.position] << 8);
		}
		
		this.position += 2;
		return result;
	}
	
	function readInt16(){
		var result = this.readUint16();
		if(result & 0x8000){
			result = -((result - 1) ^ 0xffff);
		}
		return result;
	}
	
	function readUint32(){
		if(this.data.length < this.position + 4){
			throw 'range error';
		}
		
		var result;
		
		if(this.endian === 'little'){
			result = this.data[this.position] + (this.data[this.position+1] << 8) + (this.data[this.position+2] << 16) + (this.data[this.position+3] << 24);
		}else{
			result = this.data[this.position+3] + (this.data[this.position+2] << 8) + (this.data[this.position+1] << 16) + (this.data[this.position] << 24);
		}
		
		this.position += 4;
		
		return result;
	}
	
	function readInt32(){
		var result = this.readUint32();
		if(result & 0x80000000){
			result = -((result - 1) ^ 0xffffffff);
		}
		return result;
	}
	
	function readFloat32(){
		if(this.data.length < this.position + 4){
			throw 'range error';
		}
		
		result = (new Float32Array(this.data.buffer, this.position, 1))[0];
		this.position += 4;
		return result;
	}
	
	function readFloat64(){
		if(this.data.length < this.position + 8){
			throw 'range error';
		}
		
		result = (new Float64Array(this.data.buffer, this.position, 1))[0];
		this.position += 8;
		return result;
	}
	
	
	
	binaryReader.prototype = {
		readAsciiString:readAsciiString,
		readBytes:readBytes,
		readInt8:readInt8,
		readUint8:readUint8,
		readInt16:readInt16,
		readUint16:readUint16,
		readInt32:readInt32,
		readUint32:readUint32,
		readFloat32:readFloat32,
		readFloat64:readFloat64
	}
	
	return binaryReader;
})();