mod core;
use core::ffx::FFX;

fn main() {
    // println!("Hello, world!");
    let file = "./public/t1.ffx";
    let ffx = FFX::new(file.to_string());
    // println!("{:?}", ffx); // 输出：FFX { file: 14 characters }

    let _ = ffx.parse();
}
