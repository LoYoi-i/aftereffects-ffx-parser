use std::io;

pub struct ByteReader {
    data: Vec<u8>,
    position: usize,
}

#[warn(dead_code)]
#[allow(dead_code)]
impl ByteReader {
    // 创建一个新的 ByteReader 对象
    pub fn new(data: Vec<u8>) -> Self {
        ByteReader { data, position: 0 }
    }

    // 读取指定数量的字节
    pub fn read(&mut self, len: usize) -> io::Result<Vec<u8>> {
        if self.position + len > self.data.len() {
            return Err(io::Error::new(
                io::ErrorKind::UnexpectedEof,
                "Not enough bytes to read",
            ));
        }

        let result = self.data[self.position..self.position + len].to_vec();
        self.position += len;

        Ok(result)
    }

    // 读取指定数量的字节并返回十六进制字符串
    pub fn read_hex(&mut self, len: usize) -> io::Result<String> {
        let bytes = self.read(len)?;
        Ok(bytes.iter().map(|b| format!("{:02x}", b)).collect())
    }

    // 读取指定数量的字节并尝试解析为 UTF-8 字符串
    pub fn read_string(&mut self, len: usize) -> Result<String, anyhow::Error> {
        // let bytes = self.read(len)?;
        // let a = std::str::from_utf8(&bytes).map(|s| s.to_string())?;
        // Ok(a)
        let bytes = self.read(len)?;
        let result = String::from_utf8_lossy(&bytes).into_owned(); // 强行解码
        Ok(result)
    }

    // 读取 1 个字节并解析为 u8
    pub fn read_u8(&mut self) -> io::Result<u8> {
        let bytes = self.read(1)?;
        Ok(bytes[0])
    }

    // 读取 2 个字节并解析为 u16（小端序）
    fn read_u16(&mut self) -> io::Result<u16> {
        let bytes = self.read(2)?;
        Ok(u16::from_le_bytes([bytes[0], bytes[1]]))
    }

    // 读取 4 个字节并解析为 u32（小端序）
    fn read_u32(&mut self) -> io::Result<u32> {
        let bytes = self.read(4)?;
        Ok(u32::from_le_bytes([bytes[0], bytes[1], bytes[2], bytes[3]]))
    }

    // 读取 8 个字节并解析为 u64（小端序）
    fn read_u64(&mut self) -> io::Result<u64> {
        let bytes = self.read(8)?;
        Ok(u64::from_le_bytes([
            bytes[0], bytes[1], bytes[2], bytes[3], bytes[4], bytes[5], bytes[6], bytes[7],
        ]))
    }

    // 读取 1 个字节并解析为 i8
    fn read_i8(&mut self) -> io::Result<i8> {
        let bytes = self.read(1)?;
        Ok(bytes[0] as i8)
    }

    // 读取 2 个字节并解析为 i16（小端序）
    fn read_i16(&mut self) -> io::Result<i16> {
        let bytes = self.read(2)?;
        Ok(i16::from_le_bytes([bytes[0], bytes[1]]))
    }

    // 读取 4 个字节并解析为 i32（小端序）
    fn read_i32(&mut self) -> io::Result<i32> {
        let bytes = self.read(4)?;
        Ok(i32::from_le_bytes([bytes[0], bytes[1], bytes[2], bytes[3]]))
    }

    // 读取 8 个字节并解析为 i64（小端序）
    fn read_i64(&mut self) -> io::Result<i64> {
        let bytes = self.read(8)?;
        Ok(i64::from_le_bytes([
            bytes[0], bytes[1], bytes[2], bytes[3], bytes[4], bytes[5], bytes[6], bytes[7],
        ]))
    }
}
