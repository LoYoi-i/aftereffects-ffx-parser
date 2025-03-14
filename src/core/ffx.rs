use std::fs;

pub struct FFX {
    file: String,
}

// 普通impl块：仅包含方法，无关联项
impl FFX {
    pub fn new(f: String) -> Self {
        FFX { file: f }
    }

    pub fn parse(&self) -> Result<(), &str> {
        let _ = parse_ffx(&self.file);
        // println!("开始解析文件: {}", self.file);
        Ok(())
    }
}

// 为trait实现时：必须实现所有关联项
impl std::fmt::Debug for FFX {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "FFX {{ file: {} characters }}", self.file.len())
    }
}

fn parse_ffx(file: &str) -> Result<(), anyhow::Error> {
    use super::byte_reader::ByteReader;
    if file.is_empty() {
        return Err(anyhow::anyhow!("file is empty"));
    }

    let file_data = fs::read(file)?;
    let mut reader = ByteReader::new(file_data.clone());

    let header = reader.read_string(4)?;
    println!("文件头：{}", header);

    let _2 = reader.read_hex(4)?;
    println!("{}", _2);

    let b3 = reader.read_hex(32)?;
    println!("{}", b3);

    let _4 = reader.read_hex(4)?;
    println!("{}", _4);

    println!("----------------------------");
    let _5 = reader.read_string(72)?;
    println!("{}", _5);

    let _5 = reader.read_string(36)?;
    println!("{}", _5);

    let _5 = reader.read_string(27)?;
    println!("{}", _5);

    let _5 = reader.read_string(41)?;
    println!("{}", _5);

    let _5 = reader.read_string(31)?;
    println!("{}", _5);

    // 28
    let _5 = reader.read_hex(1)?;
    println!("{}", _5);

    let _5 = reader.read_string(40)?;
    println!("{}", _5);

    let _5 = reader.read_hex(7)?;
    println!("{}", _5);

    // fileArray.push(createPart2Name(controlName));
    let mut nl1 = reader.read_u8()?;
    println!("nli {}", nl1);

    // 根据 nl1 的奇偶性调整长度
    if nl1 % 2 == 0 {
        nl1 += 2;
    } else {
        nl1 += 1;
    }

    let _5 = reader.read_hex(nl1.into())?;
    println!("{}", _5);

    // 4C495354000000
    let _5 = reader.read_hex(7)?;
    println!("{}", _5);

    // (ADBE End of path sentinel
    let _5 = reader.read_string(101)?;
    println!("{}", _5);

    // 4C495354
    let _5 = reader.read_hex(4)?;
    println!("{}", _5);

    // 00000000
    let _5 = reader.read_hex(4)?;
    println!("{}", _5);

    // 73737063666E616D000000
    let _5 = reader.read_string(11)?;
    println!("{}", _5);

    let _5 = reader.read_string(49)?;
    println!("{}", _5);

    // 4C495354
    let _5 = reader.read_hex(4)?;
    println!("{}", _5);

    // 00000000
    let _5 = reader.read_hex(4)?;
    println!("{}", _5);


    let _5 = reader.read_hex(15)?;
    println!("{}", _5);



    Ok(())
}
