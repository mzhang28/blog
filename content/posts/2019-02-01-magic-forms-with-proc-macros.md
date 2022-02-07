+++
title = "Magic forms with proc macros: Ideas"
date = 2019-02-01
tags = ["computers", "web"]
languages = ["rust"]
+++

Procedural macros (proc macros for short) in Rust are incredible because they allow arbitrary pre-compile source transformation, which leads to endless possibilities (and hazards!). But if we take careful advantage of this feature, we can use it to make clean abstractions for messy boilerplate, especially in the case of web forms. <!--more-->

In fact, proc macros are incredibly pervasive around Rust's ecosystem. For example, using the [`serde`][1] serialization/deserialization crate, you can simply write:

```rs
#[derive(Serialize)]
struct Foo {
    bar: String,
}
```

and code will be generated to serialize and deserialize to a multitude of formats including JSON, YAML, CBOR, etc.

It occurred to me that this feature can also be useful for generating code for rendering and validating forms (as in a place where you fill out info). **wtforms** is one of the nicest Python packages for handling form behavior in web applications, and with the power of proc macros, this functionality can be easily achieved in Rust as well.

In this post I'm going to outline some of the ideas I have for a wtforms-ish library for handling forms in Rust.

## Code generation

Ideally, we should be able to use this library like this:

```rs
#[derive(Form)]
struct RegisterForm {
    #[validators(email, custom("not_taken"))]
    id: Email,
    #[validators(required, length(4, 12))]
    name: String,
    #[validators(required, length(8, 128))]
    pass: Password,
}
```

What this would do is add a couple more functions to our form class. Firstly, I'd like to render an HTML version of the above form. Calling something like `RegisterForm::html()` should produce the following HTML (prettified here for convenience):

```html
<form>
    <input type="email" name="id" />
    <input type="text" name="name" />
    <input type="password" name="pass" />
    <input type="submit" />
</form>
```

If we were to want to customize our form in any way, for example, adding more attributes to the elements, we would just attach that as a separate attribute onto the field:

```rs
#[validators(required, length(4, 12))]
#[attrs = "autocomplete=off"]
name: String,
```

This should generate the following HTML:

```html
<input type="text" name="name" autocomplete=off />
```

I realize this is probably not very flexible, since you'd really only be able to use this form in a specific context. But in reality, how much do you really lose by redefining that form?

## Validation

You've already seen the `validators` attribute used above. This defines a set of validators that we'd like to verify the form against. Suppose you receive an instance of the form that looks like (in pseudo-y Rust):

```rs
let instance = RegisterForm {
    id: Email("michael@example.com"),
    name: "michael",
    pass: Password("pass"),
}
```

then calling something like `instance.verify()` should run all those validators we've defined on the fields and return a list of errors that go along with each of the fields. For this instance, for example, we should at least get an error that states that the password provided was way too short.

## Other interesting features

- If a form fails during validation, the user is presented with the errors and a chance to retry the form. At this point, the HTML generated should fill in the values for the fields that passed the validation so the user doesn't have to fill it out again. You see this behavior on web forms sometimes.

## Conclusion

This project is a work in progress! You can see how far I am [on Github](https://github.com/iptq/wtforms).

[1]: https://docs.rs/serde
