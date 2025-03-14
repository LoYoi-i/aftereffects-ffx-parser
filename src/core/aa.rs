use std::fs::File;
use std::io::{Write, Read};
use std::path::Path;
use base64::decode;
use urlencoding::decode as url_decode;
use serde_json::Value;

fn create_file(
    control_name_b: &str,
    match_name_b: &str,
    controls_array_b: &str,
    apply_it: bool,
    is_trial: bool,
    replace_it: bool,
    manual_match: bool,
) -> Result<String, Box<dyn std::error::Error>> {
    let control_name = url_decode(&decode(control_name_b)?)?;
    let match_name = url_decode(&decode(match_name_b)?)?;
    let controls_array: Value = serde_json::from_str(&url_decode(&decode(controls_array_b)?)?)?;

    let beta = false;
    let trial = is_trial;
    let path = std::env::current_exe()?.to_string_lossy().to_string();
    let start = path.find("After%20Effects").unwrap_or(0);
    let end = path[start..].find('/').unwrap_or(path.len());
    let ae_version = &path[start..end];
    let save_folder = format!(
        "{}/Adobe/{}/User Presets/Pseudo Effects Maker/",
        std::env::var("USERPROFILE")?,
        ae_version
    );
    let output_file_name = "PEM-temp";
    let effect_matchname = match_name;

    let mut file_array = Vec::new();
    file_array.push(hex_to_file_string("52494658")?);
    file_array.push(hex_to_file_string("00000000")?);
    file_array.push(hex_to_file_string("466146586865616400000010000000030000004400000001010000004C495354")?);
    file_array.push(hex_to_file_string("00000000")?);
    file_array.push(hex_to_file_string("626573636265736F0000003800000001000000010000000000005DA8001DF8520000000000640064006400643FF00000000000003FF000000000000000000000FFFFFFFF4C495354")?);
    file_array.push(hex_to_file_string("000000AC7464737074646F7400000004FFFFFFFF7464706C00000004000000024C495354")?);
    file_array.push(hex_to_file_string("00000040746473697464697800000004FFFFFFFF74646D6E000000")?);
    file_array.push(hex_to_file_string("2841444245204566666563742050617261646500000000000000000000000000000000000000000000")?);
    file_array.push(hex_to_file_string("4C495354000000407464736974646978000000040000000074646D6E000000")?);

    file_array.push(hex_to_file_string("28")?);
    file_array.push(create_match_name(-1, &effect_matchname)?);
    file_array.push(hex_to_file_string("7464736E000000")?);
    file_array.push(create_part2_name(&control_name)?);
    file_array.push(hex_to_file_string("4C495354000000")?);
    file_array.push(hex_to_file_string("647464737074646F7400000004FFFFFFFF7464706C00000004000000014C49535400000040746473697464697800000004FFFFFFFF74646D6E000000284144424520456E64206F6620706174682073656E74696E656C000000000000000000000000000000")?);
    file_array.push(hex_to_file_string("4C495354")?);
    file_array.push(hex_to_file_string("00000000")?);
    file_array.push(hex_to_file_string("73737063666E616D000000")?);
    file_array.push(hex_to_file_string("30000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000")?);
    file_array.push(hex_to_file_string("4C495354")?);
    file_array.push(hex_to_file_string("00000000")?);
    file_array.push(hex_to_file_string("706172547061726E00000004000000")?);

    let mut e_counter = 0;
    let mut e_array = Vec::new();
    e_array.push(create_first_item(&pad4(e_counter), true, false)?);
    e_counter += 1;

    if beta {
        e_array.push(create_text_item(&pad4(e_counter), "Pseudo Effects Maker|Beta v0.94", true, false)?);
        e_counter += 1;
        e_array.push(create_empty_item(&pad4(e_counter), false, false, &control_name)?);
        e_counter += 1;
    }

    if trial {
        e_array.push(create_text_item(&pad4(e_counter), "Pseudo Effects Maker | Trial", true, false)?);
        e_counter += 1;
        e_array.push(create_empty_item(&pad4(e_counter), false, false, &control_name)?);
        e_counter += 1;
        e_array.push(create_text_item(&pad4(e_counter), "By BatchFrame", true, false)?);
        e_counter += 1;
        e_array.push(create_empty_item(&pad4(e_counter), false, false, &control_name)?);
        e_counter += 1;
        e_array.push(create_text_item(&pad4(e_counter), "Purchase full version to", true, false)?);
        e_counter += 1;
        e_array.push(create_empty_item(&pad4(e_counter), false, false, &control_name)?);
        e_counter += 1;
        e_array.push(create_text_item(&pad4(e_counter), "remove watermark", true, false)?);
        e_counter += 1;
        e_array.push(create_empty_item(&pad4(e_counter), false, false, &control_name)?);
        e_counter += 1;
    }

    let slider = "slider";
    let angle = "angle";
    let color = "color";
    let layer = "layer";
    let point = "point";
    let point3d = "point3d";
    let popup = "popup";
    let group = "group";
    let text = "text";
    let label = "label";
    let check = "checkbox";
    let end = "endgroup";
    let end_label = "endLabel";
    let mut last_item = false;
    let mut cur_control = None;

    for (e, control) in controls_array.as_array().unwrap().iter().enumerate() {
        if e + 1 == controls_array.as_array().unwrap().len() {
            last_item = true;
        }
        cur_control = Some(control);
        match control["type"].as_str().unwrap() {
            "slider" => {
                e_array.push(create_slider_item(
                    &pad4(e_counter),
                    last_item,
                    control["name"].as_str().unwrap(),
                    control["validMin"].as_f64().unwrap(),
                    control["validMax"].as_f64().unwrap(),
                    control["sliderMin"].as_f64().unwrap(),
                    control["sliderMax"].as_f64().unwrap(),
                    control["default"].as_f64().unwrap(),
                    control["precision"].as_i64().unwrap(),
                    control["percent"].as_bool().unwrap(),
                    control["pixel"].as_bool().unwrap(),
                    control["keyframes"].as_bool().unwrap(),
                    control["hold"].as_bool().unwrap(),
                    control["invisible"].as_bool().unwrap(),
                )?);
            }
            "angle" => {
                e_array.push(create_angle_item(
                    &pad4(e_counter),
                    last_item,
                    control["name"].as_str().unwrap(),
                    control["default"].as_f64().unwrap(),
                    control["keyframes"].as_bool().unwrap(),
                    control["hold"].as_bool().unwrap(),
                )?);
            }
            "color" => {
                e_array.push(create_color_item(
                    &pad4(e_counter),
                    last_item,
                    control["name"].as_str().unwrap(),
                    control["red"].as_f64().unwrap(),
                    control["green"].as_f64().unwrap(),
                    control["blue"].as_f64().unwrap(),
                    control["keyframes"].as_bool().unwrap(),
                    control["hold"].as_bool().unwrap(),
                    control["invisible"].as_bool().unwrap(),
                )?);
            }
            "layer" => {
                e_array.push(create_layer_item(
                    &pad4(e_counter),
                    last_item,
                    control["name"].as_str().unwrap(),
                    control["default"].as_i64().unwrap(),
                    control["keyframes"].as_bool().unwrap(),
                    control["hold"].as_bool().unwrap(),
                    control["invisible"].as_bool().unwrap(),
                )?);
            }
            "point" => {
                e_array.push(create_point_item(
                    &pad4(e_counter),
                    last_item,
                    control["name"].as_str().unwrap(),
                    control["percentX"].as_bool().unwrap(),
                    control["percentY"].as_bool().unwrap(),
                    control["keyframes"].as_bool().unwrap(),
                    control["hold"].as_bool().unwrap(),
                    control["invisible"].as_bool().unwrap(),
                )?);
            }
            "point3d" => {
                e_array.push(create_3d_point_item(
                    &pad4(e_counter),
                    last_item,
                    control["name"].as_str().unwrap(),
                    control["percentX"].as_bool().unwrap(),
                    control["percentY"].as_bool().unwrap(),
                    control["percentZ"].as_bool().unwrap(),
                    control["keyframes"].as_bool().unwrap(),
                    control["hold"].as_bool().unwrap(),
                    control["invisible"].as_bool().unwrap(),
                )?);
            }
            "popup" => {
                e_array.push(create_popup_item(
                    &pad4(e_counter),
                    last_item,
                    control["name"].as_str().unwrap(),
                    control["content"].as_str().unwrap(),
                    control["default"].as_i64().unwrap(),
                    control["keyframes"].as_bool().unwrap(),
                    control["hold"].as_bool().unwrap(),
                    control["invisible"].as_bool().unwrap(),
                )?);
            }
            "group" => {
                e_array.push(create_text_item(
                    &pad4(e_counter),
                    control["name"].as_str().unwrap(),
                    false,
                    control["invisible"].as_bool().unwrap(),
                )?);
            }
            "checkbox" => {
                e_array.push(create_checkbox_control(
                    &pad4(e_counter),
                    last_item,
                    control["name"].as_str().unwrap(),
                    control["label"].as_str().unwrap(),
                    control["default"].as_bool().unwrap(),
                    control["keyframes"].as_bool().unwrap(),
                    control["hold"].as_bool().unwrap(),
                    control["invisible"].as_bool().unwrap(),
                )?);
            }
            "label" => {
                e_array.push(create_text_item(
                    &pad4(e_counter),
                    control["name"].as_str().unwrap(),
                    control["dim"].as_bool().unwrap(),
                    control["invisible"].as_bool().unwrap(),
                )?);
            }
            "text" => {
                e_array.push(create_text_item(
                    &pad4(e_counter),
                    control["name"].as_str().unwrap(),
                    control["dim"].as_bool().unwrap(),
                    false,
                )?);
                e_counter += 1;
            }
            "endgroup" | "endLabel" => {
                e_array.push(create_empty_item(
                    &pad4(e_counter),
                    false,
                    last_item,
                    &control_name,
                )?);
            }
            _ => {
                return Err("Error: This shouldn't happen. Please contact BatchFrame support if this error continues to appear.".into());
            }
        }
        e_counter += 1;
    }

    file_array.push(hex_to_file_string(&format!("{:02X}74646D6E000000", e_counter))?);
    for e in e_array {
        file_array.push(e[0].clone());
    }
    let par_tparn_end = file_array.push(hex_to_file_string("4C495354")?);
    file_array.push(hex_to_file_string("00000000")?);
    file_array.push(hex_to_file_string("746467707464736200000004000000017464736E")?);
    file_array.push(hex_to_file_string("000000")?);
    file_array.push(create_part2_name(&control_name)?);
    file_array.push(hex_to_file_string("74646D6E000000")?);
    for e in e_array {
        file_array.push(e[1].clone());
    }
    file_array.push(hex_to_file_string("28414442452047726F757020456E640000000000000000000000000000000000000000000000000000")?);

    set_file_remain(remain1, &mut file_array)?;
    set_file_remain(remain2, &mut file_array)?;
    set_file_remain(remain3, &mut file_array)?;
    set_distance(remain4, par_tparn_end, &mut file_array)?;
    set_file_remain(remain5, &mut file_array)?;

    let full_file = file_array.join("");
    let out_obj = serde_json::json!({
        "controlArray": controls_array,
        "controlName": control_name,
        "matchname": effect_matchname,
        "version": 3,
    });
    let full_file = format!("{}{}", full_file, out_obj.to_string());

    if apply_it {
        // Apply the effect logic here
        // This part is highly dependent on the environment and application logic
        // For example, if this is for a desktop application, you might need to interact with the file system or UI
        // This is just a placeholder for the actual logic
        println!("Effect applied");
        Ok("applied".to_string())
    } else {
        // Save the effect logic here
        // This part is also highly dependent on the environment
        // For example, if this is for a desktop application, you might need to interact with the file system or UI
        // This is just a placeholder for the actual logic
        println!("Effect saved");
        Ok("saved".to_string())
    }
}

fn hex_to_file_string(hex: &str) -> Result<String, Box<dyn std::error::Error>> {
    let bytes = hex::decode(hex)?;
    Ok(String::from_utf8(bytes)?)
}

fn pad4(num: usize) -> String {
    format!("{:04X}", num)
}

fn create_match_name(index: i32, name: &str) -> Result<String, Box<dyn std::error::Error>> {
    Ok(format!("{:02X}{}", index, name))
}

fn create_part2_name(name: &str) -> Result<String, Box<dyn std::error::Error>> {
    Ok(format!("{:02X}{}", name.len(), name))
}

fn create_first_item(id: &str, dim: bool, invisible: bool) -> Result<Vec<String>, Box<dyn std::error::Error>> {
    Ok(vec![
        hex_to_file_string(&format!("{:02X}74646D6E000000", id))?,
        hex_to_file_string(&format!("{:02X}{}", if dim { "01" } else { "00" }, if invisible { "01" } else { "00" }))?,
    ])
}

fn create_text_item(id: &str, text: &str, dim: bool, invisible: bool) -> Result<Vec<String>, Box<dyn std::error::Error>> {
    Ok(vec![
        hex_to_file_string(&format!("{:02X}74646D6E000000", id))?,
        hex_to_file_string(&format!("{:02X}{}", if dim { "01" } else { "00" }, if invisible { "01" } else { "00" }))?,
        hex_to_file_string(&format!("{:02X}{}", text.len(), text))?,
    ])
}

fn create_empty_item(id: &str, dim: bool, last_item: bool, name: &str) -> Result<Vec<String>, Box<dyn std::error::Error>> {
    Ok(vec![
        hex_to_file_string(&format!("{:02X}74646D6E000000", id))?,
        hex_to_file_string(&format!("{:02X}{}", if dim { "01" } else { "00" }, if last_item { "01" } else { "00" }))?,
        hex_to_file_string(&format!("{:02X}{}", name.len(), name))?,
    ])
}

fn create_slider_item(
    id: &str,
    last_item: bool,
    name: &str,
    valid_min: f64,
    valid_max: f64,
    slider_min: f64,
    slider_max: f64,
    default: f64,
    precision: i64,
    percent: bool,
    pixel: bool,
    keyframes: bool,
    hold: bool,
    invisible: bool,
) -> Result<Vec<String>, Box<dyn std::error::Error>> {
    Ok(vec![
        hex_to_file_string(&format!("{:02X}74646D6E000000", id))?,
        hex_to_file_string(&format!("{:02X}{}", if last_item { "01" } else { "00" }, if invisible { "01" } else { "00" }))?,
        hex_to_file_string(&format!("{:02X}{}", name.len(), name))?,
        hex_to_file_string(&format!("{:02X}{}", valid_min.to_le_bytes().len(), valid_min.to_le_bytes()))?,
        hex_to_file_string(&format!("{:02X}{}", valid_max.to_le_bytes().len(), valid_max.to_le_bytes()))?,
        hex_to_file_string(&format!("{:02X}{}", slider_min.to_le_bytes().len(), slider_min.to_le_bytes()))?,
        hex_to_file_string(&format!("{:02X}{}", slider_max.to_le_bytes().len(), slider_max.to_le_bytes()))?,
        hex_to_file_string(&format!("{:02X}{}", default.to_le_bytes().len(), default.to_le