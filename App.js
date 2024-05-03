import { useEffect, useRef, useState } from "react";
import ViewShot from "react-native-view-shot";
import {
  Row,
  CalcGroup,
  Header,
  HeaderTitle,
  HeaderSubtitle,
  Body,
  FlipCard,
  CalcArea,
  CalcLabel,
  CalcInput,
  CalcButton,
  CalcButtonText,
  ResultArea,
  ResultLabelArea,
  ResultLabel,
  ResultText,
  ResultButton,
  ResultButtonText,
  Divider,
  Footer,
  FooterText,
  // BannerAd,
} from "./assets/css/style";
import { ScrollView, Share, ToastAndroid } from "react-native";
import { A } from "@expo/html-elements";
import GeneralStatusBarColor from "./src/components/GeneralStatusBarColor";
import * as Updates from "expo-updates";
import mobileAds from "react-native-google-mobile-ads";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";

mobileAds()
  .initialize()
  .then((adapterStatuses) => {});

const adUnitId = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : "ca-app-pub-5865817649832793/5691178242";

export default App = () => {
  const [meses, setMeses] = useState("");
  const [investInicial, setInvestInicial] = useState("");
  const [investRecorrente, setInvestRecorrente] = useState("");
  const [taxa, setTaxa] = useState("");
  const [renda, setRenda] = useState("");

  const [prazo, setPrazo] = useState(0);
  const [vlrTotalAplicado, setVlrTotalAplicado] = useState(0);
  const [vlrInicialAplicado, setVlrInicialAplicado] = useState(0);
  const [vlrRecorrenteAplicado, setVlrRecorrenteAplicado] = useState(0);
  const [vlrRecorrenteAplicadoTotal, setVlrRecorrenteAplicadoTotal] =
    useState(0);
  const [vlrRendimentos, setVlrRendimentos] = useState(0);
  const [vlrAcumulado, setVlrAcumulado] = useState(0);
  const [vlrRenda, setVlrRenda] = useState(0);
  const [vlrTaxa, setVlrTaxa] = useState(0);

  const [isFlipped, setIsFlipped] = useState(false);

  const secondInputRef = useRef(null);
  const thirdInputRef = useRef(null);
  const fourthInputRef = useRef(null);
  const fifthInputRef = useRef(null);

  const handleCalc = () => {
    let investInicialClean;
    if (investInicial) investInicialClean = limparValor(investInicial);

    let investRecorrenteClean;
    if (investRecorrente) investRecorrenteClean = limparValor(investRecorrente);

    let taxaClean;
    if (taxa) taxaClean = limparValor(taxa);

    let rendaClean;
    if (renda) rendaClean = limparValor(renda);

    if (meses && investInicial && investRecorrente && taxa && renda) {
      ToastAndroid.showWithGravity(
        "Erro! Deixe pelo menos 1 campo em branco para calculá-lo.",
        ToastAndroid.LONG,
        ToastAndroid.CENTER
      );
      return;
    }

    // Calcular Prazo
    else if (!meses && investInicial && investRecorrente && taxa && renda) {
      let vlrAtual = investInicialClean;
      let montante = rendaClean / (taxaClean / 100);
      let loop = 0;
      let continuar = true;

      while (continuar) {
        if (
          vlrAtual * (1 + taxaClean / 100) + investRecorrenteClean <
          montante
        ) {
          vlrAtual = vlrAtual * (1 + taxaClean / 100) + investRecorrenteClean;
        } else {
          continuar = false;
        }
        loop++;
      }

      let newPrazo = loop - 1;
      let newAplicadoInicial = investInicialClean;
      let newAplicadoRecorrente = investRecorrenteClean;
      let newAplicadoRecorrenteTotal = newAplicadoRecorrente * newPrazo;
      let newAplicadoTotal = newAplicadoInicial + newAplicadoRecorrenteTotal;
      let newAcumulado = parseFloat(vlrAtual.toFixed(2));
      let newRendimentos =
        newAcumulado - newAplicadoRecorrente * newPrazo - newAplicadoInicial;
      let newRenda = parseFloat((newAcumulado * (taxaClean / 100)).toFixed(2));
      let newTaxa = parseFloat(taxaClean.toFixed(2));

      setPrazo(newPrazo);
      setVlrInicialAplicado(newAplicadoInicial);
      setVlrRecorrenteAplicado(newAplicadoRecorrente);
      setVlrRecorrenteAplicadoTotal(newAplicadoRecorrenteTotal);
      setVlrTotalAplicado(newAplicadoTotal);
      setVlrAcumulado(newAcumulado);
      setVlrRendimentos(newRendimentos);
      setVlrRenda(newRenda);
      setVlrTaxa(newTaxa);

      setIsFlipped(!isFlipped);
      return;
    }

    // Calcular Investimento Inicial
    else if (meses && !investInicial && investRecorrente && taxa && renda) {
      let montante = rendaClean / (taxaClean / 100);
      let taxaAtualizada = Math.pow(1 + taxaClean / 100, meses);
      let investRecorrenteAtualizado =
        investRecorrenteClean * ((taxaAtualizada - 1) / (taxaClean / 100));
      let investInicialAtualizado = montante - investRecorrenteAtualizado;
      let investInicial = investInicialAtualizado / taxaAtualizada;

      let newPrazo = meses;
      let newAplicadoInicial = parseFloat(investInicial.toFixed(2));
      let newAplicadoRecorrente = investRecorrenteClean;
      let newAplicadoRecorrenteTotal = newAplicadoRecorrente * newPrazo;
      let newAplicadoTotal = newAplicadoInicial + newAplicadoRecorrenteTotal;
      let newAcumulado = parseFloat(montante.toFixed(2));
      let newRendimentos =
        newAcumulado - newAplicadoRecorrente * newPrazo - newAplicadoInicial;
      let newRenda = parseFloat((newAcumulado * (taxaClean / 100)).toFixed(2));
      let newTaxa = parseFloat(taxaClean.toFixed(2));

      setPrazo(newPrazo);
      setVlrInicialAplicado(newAplicadoInicial);
      setVlrRecorrenteAplicado(newAplicadoRecorrente);
      setVlrRecorrenteAplicadoTotal(newAplicadoRecorrenteTotal);
      setVlrTotalAplicado(newAplicadoTotal);
      setVlrAcumulado(newAcumulado);
      setVlrRendimentos(newRendimentos);
      setVlrRenda(newRenda);
      setVlrTaxa(newTaxa);

      setIsFlipped(!isFlipped);
      return;
    }

    // Calcular Investimento Recorrente
    else if (meses && investInicial && !investRecorrente && taxa && renda) {
      let montante = rendaClean / (taxaClean / 100);
      let investInicialCalc =
        investInicialClean * Math.pow(1 + taxaClean / 100, meses);
      let taxaCalc =
        (Math.pow(1 + taxaClean / 100, meses) - 1) / (taxaClean / 100);

      let investRecorrente = (montante - investInicialCalc) / taxaCalc;

      let newPrazo = meses;
      let newAplicadoInicial = investInicialClean;
      let newAplicadoRecorrente = parseFloat(investRecorrente.toFixed(2));
      let newAplicadoRecorrenteTotal = newAplicadoRecorrente * newPrazo;
      let newAplicadoTotal = newAplicadoInicial + newAplicadoRecorrenteTotal;
      let newAcumulado = parseFloat(montante.toFixed(2));
      let newRendimentos =
        newAcumulado - newAplicadoRecorrente * newPrazo - newAplicadoInicial;
      let newRenda = parseFloat((newAcumulado * (taxaClean / 100)).toFixed(2));
      let newTaxa = parseFloat(taxaClean.toFixed(2));

      setPrazo(newPrazo);
      setVlrInicialAplicado(newAplicadoInicial);
      setVlrRecorrenteAplicado(newAplicadoRecorrente);
      setVlrRecorrenteAplicadoTotal(newAplicadoRecorrenteTotal);
      setVlrTotalAplicado(newAplicadoTotal);
      setVlrAcumulado(newAcumulado);
      setVlrRendimentos(newRendimentos);
      setVlrRenda(newRenda);
      setVlrTaxa(newTaxa);

      setIsFlipped(!isFlipped);
      return;
    }

    // Calcular Taxa
    else if (meses && investInicial && investRecorrente && !taxa && renda) {
      let t = 0.01;
      let r = 0;
      let n = meses;
      let cont = true;
      let investInicialAtualizado;
      let investRecorrenteAtualizado;
      let montante;
      let montanteAtualizado;

      while (cont) {
        investInicialAtualizado = investInicialClean * Math.pow(1 + t / 100, n);
        investRecorrenteAtualizado =
          investRecorrenteClean * ((Math.pow(1 + t / 100, n) - 1) / (t / 100));
        montante = investInicialAtualizado + investRecorrenteAtualizado;
        r = montante * (t / 100);
        if (r >= rendaClean) {
          cont = false;
        } else {
          rendaAtualizada = r;
          montanteAtualizado = montante;
          taxaAtualizada = t;
          t = t + 0.01;
        }
      }

      let newPrazo = n;
      let newAplicadoInicial = investInicialClean;
      let newAplicadoRecorrente = investRecorrenteClean;
      let newAplicadoRecorrenteTotal = newAplicadoRecorrente * newPrazo;
      let newAplicadoTotal = newAplicadoInicial + newAplicadoRecorrenteTotal;
      let newAcumulado = parseFloat(montanteAtualizado.toFixed(2));
      let newRendimentos =
        newAcumulado - newAplicadoRecorrente * newPrazo - newAplicadoInicial;
      let newRenda = parseFloat(
        (newAcumulado * (taxaAtualizada / 100)).toFixed(2)
      );
      let newTaxa = parseFloat(taxaAtualizada.toFixed(2));

      setPrazo(newPrazo);
      setVlrInicialAplicado(newAplicadoInicial);
      setVlrRecorrenteAplicado(newAplicadoRecorrente);
      setVlrRecorrenteAplicadoTotal(newAplicadoRecorrenteTotal);
      setVlrTotalAplicado(newAplicadoTotal);
      setVlrAcumulado(newAcumulado);
      setVlrRendimentos(newRendimentos);
      setVlrRenda(newRenda);
      setVlrTaxa(newTaxa);

      setIsFlipped(!isFlipped);
      return;
    }

    // Calcular Renda Passiva
    else if (meses && investInicial && investRecorrente && taxa && !renda) {
      const acumulado =
        investRecorrenteClean *
          ((Math.pow(1 + taxaClean / 100, meses) - 1) / (taxaClean / 100)) +
        investInicialClean * Math.pow(1 + taxaClean / 100, meses);

      let newPrazo = meses;
      let newAplicadoInicial = investInicialClean;
      let newAplicadoRecorrente = investRecorrenteClean;
      let newAplicadoRecorrenteTotal = newAplicadoRecorrente * newPrazo;
      let newAplicadoTotal = newAplicadoInicial + newAplicadoRecorrenteTotal;
      let newAcumulado = parseFloat(acumulado.toFixed(2));
      let newRendimentos =
        newAcumulado - newAplicadoRecorrente * newPrazo - newAplicadoInicial;
      let newRenda = parseFloat((newAcumulado * (taxaClean / 100)).toFixed(2));
      let newTaxa = parseFloat(taxaClean.toFixed(2));

      setPrazo(newPrazo);
      setVlrInicialAplicado(newAplicadoInicial);
      setVlrRecorrenteAplicado(newAplicadoRecorrente);
      setVlrRecorrenteAplicadoTotal(newAplicadoRecorrenteTotal);
      setVlrTotalAplicado(newAplicadoTotal);
      setVlrAcumulado(newAcumulado);
      setVlrRendimentos(newRendimentos);
      setVlrRenda(newRenda);
      setVlrTaxa(newTaxa);

      setIsFlipped(!isFlipped);
      return;
    } else {
      ToastAndroid.showWithGravity(
        "Erro! Deixe apenas 1 campo em branco para calculá-lo.",
        ToastAndroid.LONG,
        ToastAndroid.CENTER
      );
      return;
    }
  };

  const formatarValor = (valor) => {
    // Remover caracteres não numéricos e zeros à esquerda
    valor = valor.replace(/[^0-9]/g, "").replace(/^0+(?=\d)/, "");

    // Se o valor estiver vazio após a remoção, retorna string vazia
    if (valor == 0) return "";

    // Adiciona zeros à esquerda se necessário para garantir pelo menos 3 dígitos
    valor = valor.padStart(3, "0");

    // Separa parte inteira e decimal
    let parteInteira = valor.slice(0, -2);
    let parteDecimal = valor.slice(-2);

    // Adiciona pontos como separadores de milhar na parte inteira
    parteInteira = parteInteira.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    // Combina parte inteira e decimal com uma vírgula
    return `${parteInteira},${parteDecimal}`;
  };

  const limparValor = (valor) => {
    return parseFloat(valor.replace(/['.']/g, "").replace(",", "."));
  };

  const handleClean = () => {
    setMeses("");
    setInvestInicial("");
    setInvestRecorrente("");
    setTaxa("");
    setRenda("");
  };

  const viewShotRef = useRef(null);

  const captureAndShareScreenshot = () => {
    if (viewShotRef.current) {
      viewShotRef.current.capture().then((uri) => {
        Share.share({
          message:
            "Prazo: " +
            prazo +
            " meses\n" +
            "Valor Total Investido: \n$ " +
            vlrTotalAplicado.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) +
            "\n" +
            "Valor Inicial Investido: \n$ " +
            vlrInicialAplicado.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) +
            "\n" +
            "Valor Recorrente Investido: \n$ " +
            vlrRecorrenteAplicadoTotal.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) +
            "\n" +
            "Rendimentos: \n$ " +
            vlrRendimentos.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) +
            "\n" +
            "Valor Acumulado: \n$ " +
            vlrAcumulado.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) +
            "\n" +
            "Taxa Mensal: " +
            vlrTaxa.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) +
            "%\n" +
            "Valor Renda Passiva: \n$ " +
            vlrRenda.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) +
            "\n",
          url: uri,
        })
          .then((res) => console.log(res))
          .catch((error) => console.log(error));
      });
    }
  };

  const [isPrazoFocused, setIsPrazoFocused] = useState(false);
  const [isInvestIniFocused, setIsInvestIniFocused] = useState(false);
  const [isInvestRecorrFocused, setIsInvestRecorrFocused] = useState(false);
  const [isTaxaFocused, setIsTaxaFocused] = useState(false);
  const [isRendaFocused, setIsRendaFocused] = useState(false);

  useEffect(() => {
    async function updateApp() {
      const { isAvailable } = await Updates.checkForUpdateAsync();
      if (isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync(); // depende da sua estratégia
      }
    }
    updateApp();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      backgroundColor={"#333"}
    >
      <GeneralStatusBarColor backgroundColor="#333" barStyle="light-content" />
      <Header>
        <HeaderTitle>Calcular Renda Passiva</HeaderTitle>
        <HeaderSubtitle>
          {isFlipped && "Resultados"}
          {!isFlipped && "Deixe em branco o campo a ser calculado"}
        </HeaderSubtitle>

        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        />
      </Header>

      <Body>
        <FlipCard>
          <CalcArea isFlipped={isFlipped}>
            <Row>
              <CalcGroup>
                <CalcLabel isFocused={isPrazoFocused} field={meses}>
                  Prazo (meses):{" "}
                </CalcLabel>
                <CalcInput
                  placeholder={"Prazo (meses)"}
                  placeholderTextColor="#6D6D6D"
                  onChangeText={(val) => setMeses(val)}
                  value={meses}
                  keyboardType="numeric"
                  returnKeyType="next"
                  onSubmitEditing={() => secondInputRef.current.focus()}
                  onFocus={() => setIsPrazoFocused(true)}
                  onBlur={() => setIsPrazoFocused(false)}
                  blurOnSubmit={false}
                  maxLength={3}
                />
              </CalcGroup>
              <CalcGroup>
                <CalcLabel isFocused={isTaxaFocused} field={taxa}>
                  Taxa Mensal (%):{" "}
                </CalcLabel>
                <CalcInput
                  ref={secondInputRef}
                  placeholder={"Taxa Mensal (%)"}
                  placeholderTextColor="#6D6D6D"
                  onChangeText={(val) => setTaxa(formatarValor(val))}
                  value={taxa}
                  keyboardType="numeric"
                  returnKeyType="next"
                  onSubmitEditing={() => thirdInputRef.current.focus()}
                  onFocus={() => setIsTaxaFocused(true)}
                  onBlur={() => setIsTaxaFocused(false)}
                  blurOnSubmit={false}
                  maxLength={5}
                />
              </CalcGroup>
            </Row>
            <Row>
              <CalcGroup>
                <CalcLabel isFocused={isInvestIniFocused} field={investInicial}>
                  Valor Inicial ($):{" "}
                </CalcLabel>
                <CalcInput
                  ref={thirdInputRef}
                  placeholder={"Valor Inicial ($)"}
                  placeholderTextColor="#6D6D6D"
                  onChangeText={(val) => setInvestInicial(formatarValor(val))}
                  value={investInicial}
                  keyboardType="numeric"
                  returnKeyType="next"
                  onSubmitEditing={() => fourthInputRef.current.focus()}
                  onFocus={() => setIsInvestIniFocused(true)}
                  onBlur={() => setIsInvestIniFocused(false)}
                  blurOnSubmit={false}
                  maxLength={14}
                />
              </CalcGroup>
              <CalcGroup>
                <CalcLabel
                  isFocused={isInvestRecorrFocused}
                  field={investRecorrente}
                >
                  Valor Recorrente ($):{" "}
                </CalcLabel>
                <CalcInput
                  ref={fourthInputRef}
                  placeholder={"Valor Recorrente ($)"}
                  placeholderTextColor="#6D6D6D"
                  onChangeText={(val) =>
                    setInvestRecorrente(formatarValor(val))
                  }
                  value={investRecorrente}
                  keyboardType="numeric"
                  returnKeyType="next"
                  onSubmitEditing={() => fifthInputRef.current.focus()}
                  onFocus={() => setIsInvestRecorrFocused(true)}
                  onBlur={() => setIsInvestRecorrFocused(false)}
                  blurOnSubmit={false}
                  maxLength={14}
                />
              </CalcGroup>
            </Row>
            <CalcLabel isFocused={isRendaFocused} field={renda}>
              Valor da Renda Passiva ($):{" "}
            </CalcLabel>
            <CalcInput
              ref={fifthInputRef}
              placeholder={"Valor da Renda Passiva ($)"}
              placeholderTextColor="#6D6D6D"
              onChangeText={(val) => setRenda(formatarValor(val))}
              onFocus={() => setIsRendaFocused(true)}
              onBlur={() => setIsRendaFocused(false)}
              value={renda}
              keyboardType="numeric"
              maxLength={14}
            />
            {renda && taxa && (
              <CalcLabel>
                Valor Acumulado Desejado:{" "}
                {(
                  limparValor(renda) /
                  (limparValor(taxa) / 100)
                ).toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
              </CalcLabel>
            )}
            <Row>
              <CalcGroup>
                <CalcButton onPress={handleCalc}>
                  <CalcButtonText>Calcular</CalcButtonText>
                </CalcButton>
              </CalcGroup>
              <CalcGroup>
                <CalcButton onPress={handleClean} bg={"#BB2D3B"}>
                  <CalcButtonText>Limpar</CalcButtonText>
                </CalcButton>
              </CalcGroup>
            </Row>
          </CalcArea>

          <ResultArea isFlipped={isFlipped}>
            <ViewShot
              ref={viewShotRef}
              options={{ format: "jpg", quality: 0.9 }}
            >
              <ResultLabelArea style={{ height: 60 }}>
                <ResultLabel style={{ height: 60 }}>Prazo:</ResultLabel>
                <ResultText style={{ height: 60 }}>
                  {Math.floor(prazo / 12) > 0 &&
                    Math.floor(prazo / 12) + " ano"}
                  {Math.floor(prazo / 12) > 0
                    ? Math.floor(prazo / 12) == 1
                      ? ""
                      : "s"
                    : ""}
                  {Math.floor(prazo / 12) > 0 &&
                  prazo - Math.floor(prazo / 12) * 12 > 0
                    ? " e "
                    : ""}
                  {prazo - Math.floor(prazo / 12) * 12 > 0
                    ? prazo - Math.floor(prazo / 12) * 12 == 1
                      ? prazo - Math.floor(prazo / 12) * 12 + " mês"
                      : prazo - Math.floor(prazo / 12) * 12 + " meses"
                    : ""}
                  {Math.floor(prazo / 12) > 0
                    ? prazo == 1
                      ? "\nou " + prazo + " mês"
                      : "\nou " + prazo + " meses"
                    : ""}
                </ResultText>
              </ResultLabelArea>
              <Divider />
              <ResultLabelArea>
                <ResultLabel>Valor Investido:</ResultLabel>
                <ResultText>
                  ${" "}
                  {vlrTotalAplicado.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })}
                </ResultText>
              </ResultLabelArea>
              <ResultLabelArea>
                <ResultLabel>Valor Inicial:</ResultLabel>
                <ResultText>
                  ${" "}
                  {vlrInicialAplicado.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })}
                </ResultText>
              </ResultLabelArea>
              <ResultLabelArea style={{ height: 40 }}>
                <ResultLabel style={{ height: 40 }}>
                  Valor Recorrente:
                </ResultLabel>
                <ResultText style={{ height: 40 }}>
                  ${" "}
                  {vlrRecorrenteAplicado.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })}{" "}
                  x {prazo} = {"\n"}${" "}
                  {vlrRecorrenteAplicadoTotal.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })}
                </ResultText>
              </ResultLabelArea>
              <Divider />
              <ResultLabelArea>
                <ResultLabel>Rendimentos:</ResultLabel>
                <ResultText>
                  ${" "}
                  {vlrRendimentos.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })}
                </ResultText>
              </ResultLabelArea>
              <Divider />
              <ResultLabelArea>
                <ResultLabel>Valor Acumulado:</ResultLabel>
                <ResultText>
                  ${" "}
                  {vlrAcumulado.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })}
                </ResultText>
              </ResultLabelArea>
              <Divider />
              <ResultLabelArea>
                <ResultLabel>Taxa Mensal:</ResultLabel>
                <ResultText>
                  {vlrTaxa.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  }) || "0.00"}
                  %
                </ResultText>
              </ResultLabelArea>
              <Divider />
              <ResultLabelArea style={{ height: 50 }}>
                <ResultLabel style={{ height: 50 }}>
                  Valor da Renda Passiva:
                </ResultLabel>
                <ResultText style={{ height: 50 }}>
                  ${" "}
                  {vlrRenda.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })}{" "}
                  por mês
                </ResultText>
              </ResultLabelArea>
              <Divider />
            </ViewShot>
            <Row>
              <CalcGroup>
                <ResultButton
                  onPress={() => setIsFlipped(false)}
                  bg={"#0dcaf0"}
                >
                  <ResultButtonText>Voltar</ResultButtonText>
                </ResultButton>
              </CalcGroup>
              <CalcGroup>
                <ResultButton
                  onPress={captureAndShareScreenshot}
                  bg={"#ffc107"}
                >
                  <ResultButtonText>Compartilhar</ResultButtonText>
                </ResultButton>
              </CalcGroup>
            </Row>
          </ResultArea>
        </FlipCard>
      </Body>

      <Footer>
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        />
        <FooterText>
          <A href="mailto:suporte@calcularrendapassiva.com.br?subject=Bugs, Críticas e Sugestões">
            Bugs, Críticas e Sugestões
          </A>
        </FooterText>
      </Footer>
    </ScrollView>
  );
};
