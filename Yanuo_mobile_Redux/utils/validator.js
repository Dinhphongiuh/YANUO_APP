import * as Yup from 'yup';
export const loginValid = {
    initial: {
        phoneNumber: '',
        password: '',
    },
    validationShema: Yup.object().shape({
        phoneNumber: Yup.string().test('is-valid-phone-number', 'Số điện thoại bắt đầu từ 0 và gồm 10 chữ số', value => /^0\d{9}$/.test(value)).required('Số điện thoại không được để trống!'),
        password: Yup.string().trim().min(8, 'Mật khẩu không được ít hơn 8 ký tự !').required('Mật khẩu không được để trống!'),
    })
};

export const isValidObjField = (obj) => {
    return Object.values(obj).every(value => value.trim())
}

export const updateError = (error, stateUpdater) => {
    stateUpdater(error);
    setTimeout(() => {
        stateUpdater('')
    }, 2500);
}

export const isValidPhoneNumber = (value) => {
    const regx = /^0\d{9}$/;
    return regx.test(value);
}