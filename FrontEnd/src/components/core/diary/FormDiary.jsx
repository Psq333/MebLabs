import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { List, Button, Card, Col, Row, Modal, Typography } from 'antd';
import logo from '../../../img/logo.svg';
import Api from '../../../helpers/core/Api';


const { Title } = Typography;

const ListDiary = () => {
  const history = useHistory();
  const [data, setData, logged] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const { id } = location.state || {};

  const [initialValues, setInitialValues] = useState({
    date: null,
    price: '',
    in: false
  });

  useEffect(() => {
    if (location.state && location.state.entry) {
      Api.get('/diary/read?id=' + id)
        .then(response => {
          setData(response.data);
          setInitialValues({
            date: moment(response.data.date),
            price: response.data.price,
            in: response.data.in,
      });
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
      });
      }
  }, []);

  const handleSave = values =>{
    if(data._id === undefined){ //insert
      values.id_user = logged._id;
      Api.post(`/diary/save`, { values })
        .then(navigate('/diary'))
        .catch(err => err?.globalHandler());
    }
    else { //update
      values.id_user = logged._id;
      valued._id = data._id;
      Api.post(`/diary/save`, { values })
        .then(navigate('/diary'))
        .catch(err => err?.globalHandler());
    }
  }

  const { t } = useTranslation();

  return navigator.cookieEnabled ? (
    <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
      <Card className="w-full sm:max-w-md md:mt-0 xl:p-0">
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            name="date"
            label={t('diary.date')}
            rules={[{ required: true, message: t('common.required') }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item
            name="price"
            label={t('diary.price')}
            rules={[{ required: true, message: t('common.required') }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="in"
            valuePropName="checked"
            label={t('diary.in')}
            rules={[{ required: true, message: t('common.required') }]}
          >
            <Checkbox>{t('diary.in')}</Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {t('common.submit')}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  ) : (
    Modal.error({
      title: t('cookie.title'),
      content: t('cookie.message')
    })
  );
};

export default FormDiary;