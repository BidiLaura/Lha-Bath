const Sensor = ({ sensor }) => {
  return (
    <div className="sensor">
      <h5>{sensor.Tipo_Sensor}</h5>
      <p><strong>Resultado Atual:</strong> {sensor.Resultado_Atual}</p>
    </div>
  );
};

export default Sensor;
