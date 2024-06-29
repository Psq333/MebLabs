import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { List, Button, Card, Col, Row, Modal, Typography } from 'antd';
import logo from '../../../img/logo.svg';
import Api from '../../../helpers/core/Api';
import { useHistory } from 'react-router-dom';

const { Title } = Typography;

const ListDiary = () => {
  const history = useHistory();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from the backend
    Api.get('/diary/getListDiaryById')
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
      });
  }, []);

  const handleEdit = (id = '') => {
    history.push(`/FormDiary/${id}`);
  };

  const handleAdd = history.push(`/FormDiary`);
  
  const handleDelete = (id = '') =>
    Api.delete(`/diary/delete`, { id })
      .then(() => useEffect())
      .catch(err => err?.globalHandler());
  const { t } = useTranslation();

  return navigator.cookieEnabled ? (
    <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
      <img src={logo} alt="Logo" id="logo" className="2 mb-4 h-14 w-auto" />
      <Title className="mb-6 flex items-center text-2xl">
        {t('list.title', { project: import.meta.env.VITE_NAME })}
      </Title>
      <Card className="w-full sm:max-w-md md:mt-0 xl:p-0">
      <Button onClick={() => handleAdd()}>{t('common.add')}</Button>
        <List
          loading={loading}
          dataSource={data}
          renderItem={item => (
            <List.Item>
              <Row style={{ width: '100%' }}>
                <Col flex="auto">{item.name}</Col>
                <Col flex="none">
                  <Button onClick={() => handleEdit(item.id)}>{t('common.edit')}</Button>
                </Col>
                <Col flex="none">
                  <Button onClick={() => handleDelete(item.id)}>{t('common.delete')}</Button>
                </Col>
              </Row>
            </List.Item>
          )}
        />
      </Card>
    </div>
  ) : (
    Modal.error({
      title: t('cookie.title'),
      content: t('cookie.message')
    })
  );
};

export default ListDiary;
