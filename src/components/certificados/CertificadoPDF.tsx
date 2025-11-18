import {
  Page,
  Text,
  Image,
  Document,
  StyleSheet,
  View,
  Font,
} from "@react-pdf/renderer";

// ==========================
//     REGISTRO DE FUENTES
// ==========================

Font.register({
  family: "Quattrocento",
  src: "/fonts/Quattrocento-Regular.ttf",
});

Font.register({
  family: "PetElegant",
  src: "/fonts/GreatVibes-Regular.ttf",
});

// ==========================
//        CONSTANTES
// ==========================

const PRIMARY = "#9B2C45";
const FONT_BODY = "Quattrocento";

const CERT_WIDTH = 18 * 72;
const CERT_HEIGHT = 24 * 72;

// ==========================
//         ESTILOS
// ==========================

const styles = StyleSheet.create({
  page: {
    position: "relative",
    width: CERT_WIDTH,
    height: CERT_HEIGHT,
    fontFamily: FONT_BODY,
  },

  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    top: 0,
    left: 0,
  },

  content: {
    position: "absolute",
    top: 260,
    left: 160,
    right: 160,
    textAlign: "center",
  },

  // TITULOS
  title: {
    fontSize: 48,
    color: PRIMARY,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 26,
    color: PRIMARY,
    marginBottom: 40,
  },

  // FOTO
  photoWrapper: {
    width: 240,
    height: 240,
    borderRadius: 240,
    border: `6pt solid ${PRIMARY}`,
    overflow: "hidden",
    alignSelf: "center",
    marginBottom: 45,
  },
  photo: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  label: {
    fontSize: 22,
    color: PRIMARY,
    marginBottom: 5,
  },

  // ADOPTANTE COMPLETO ARRIBA
  adoptanteCompleto: {
    fontSize: 36,
    fontWeight: "bold",
    color: PRIMARY,
    marginVertical: 8,
  },

  // MASCOTA (color guinda arriba)
  nameBigMascota: {
    fontSize: 36,
    fontWeight: "bold",
    color: PRIMARY,
    marginVertical: 10,
  },

  dottedLine: {
    fontSize: 16,
    color: PRIMARY,
    marginBottom: 22,
  },

  // TEXTO DE COMPROMISO SIN CORTAR PALABRAS
  commitment: {
    marginTop: 25,
    fontSize: 20,
    color: PRIMARY,
    lineHeight: 1.45,
    paddingHorizontal: 60,
    marginBottom: 50,
  },

  // QR
  qrContainer: {
    marginTop: 10,
    marginBottom: 30,
    alignItems: "center",
  },
  qrBox: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
  },
  qr: {
    width: 120,
    height: 120,
  },
  qrText: {
    fontSize: 18,
    marginTop: 10,
    color: PRIMARY,
  },

  // FIRMAS
  signaturesRow: {
    marginTop: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },

  firmaBox: {
    width: "33%",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "flex-start",
    height: 210, // ALTURA FIJA IGUAL
    paddingTop: 10,
  },

  firmaLine: {
    borderTop: "2pt dotted #444",
    marginTop: 18,
    marginBottom: 8,
    width: "85%",
    alignSelf: "center",
  },

  firmaLabel: {
    fontSize: 18,
    color: PRIMARY,
    marginTop: 2,
  },

  cargoLabel: {
    fontSize: 14,
    color: "#666",
  },

  footer: {
    marginTop: 70,
    fontSize: 20,
    color: PRIMARY,
  },
});

// ==========================
//     COMPONENTE PRINCIPAL
// ==========================

export default function CertificadoPDF({ adoptante, mascota, fecha }) {
  // 🔥 ADOPTANTE ARRIBA COMPLETO
  const adoptanteCompleto = adoptante;

  // 🔥 PARA FIRMA: SOLO NOMBRES
  const adoptanteFirma = adoptante.split(" ").slice(0, 2).join(" ");

  const qrURL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=CAAM-${mascota.id}`;

  return (
    <Document>
      <Page
        size={{ width: CERT_WIDTH, height: CERT_HEIGHT }}
        style={styles.page}
      >
        {/* Fondo */}
        <Image
          src="https://i.imgur.com/gbzIfLM.png"
          style={styles.background}
          fixed
        />

        <View style={styles.content}>
          <Text style={styles.title}>Certificado de Adopción</Text>
          <Text style={styles.subtitle}>
            Centro de Atención Animal de Morelia
          </Text>

          {/* FOTO */}
          <View style={styles.photoWrapper}>
            <Image src={mascota.foto} style={styles.photo} />
          </View>

          {/* ADOPTANTE COMPLETO */}
          <Text style={styles.label}>Este documento certifica que…</Text>
          <Text style={styles.adoptanteCompleto}>{adoptanteCompleto}</Text>
          <Text style={styles.dottedLine}>
            .........................................................
          </Text>

          {/* MASCOTA */}
          <Text style={styles.label}>Ha adoptado oficialmente a…</Text>
          <Text style={styles.nameBigMascota}>{mascota.nombre}</Text>
          <Text style={styles.dottedLine}>
            .........................................................
          </Text>

          {/* COMPROMISO */}
          <Text
            style={styles.commitment}
            hyphenationCallback={(word) => [word]}
          >
            Me comprometo a brindarle un hogar lleno de amor, respeto y
            cuidados. Prometo protegerlo, alimentarlo, atender su salud y
            hacerlo feliz todos los días. Desde hoy lo recibo como parte de mi
            familia para toda la vida.
          </Text>

          {/* QR */}
          <View style={styles.qrContainer}>
            <View style={styles.qrBox}>
              <Image src={qrURL} style={styles.qr} />
            </View>
            <Text style={styles.qrText}>ID de adopción: {mascota.id}</Text>
          </View>

          {/* FIRMAS */}
          <View style={styles.signaturesRow}>
            {/* DIRECTOR */}
            <View style={styles.firmaBox}>
              <Image
                src="https://i.imgur.com/nmqF7ni.png"
                style={{
                  width: 140,
                  height: 70,
                  marginTop: 35,
                  marginBottom: 0,
                }}
              />
              <Text style={styles.firmaLine} />
              <Text style={styles.firmaLabel}>Cristiano Ronaldo</Text>
              <Text style={styles.cargoLabel}>Director del CAAM</Text>
            </View>

            {/* ADOPTANTE */}
            <View style={styles.firmaBox}>
              <Text
                style={{
                  fontFamily: "PetElegant",
                  fontSize: 32,
                  color: "#000",
                  marginTop: 25,
                  marginBottom: -5,
                }}
              >
                {adoptanteFirma}
              </Text>
              <Text style={styles.firmaLine} />
              <Text style={styles.firmaLabel}>{adoptanteFirma}</Text>
              <Text style={styles.cargoLabel}>Adoptante</Text>
            </View>

            {/* MASCOTA */}
            <View style={styles.firmaBox}>
              <Image
                src="https://i.imgur.com/R98Hb19.png"
                style={{
                  width: 60,
                  height: 60,
                  marginTop: 0,
                  marginBottom: -10,
                }}
              />
              <Text
                style={{
                  fontFamily: "PetElegant",
                  fontSize: 32,
                  color: "#000",
                  marginTop: 15,
                }}
              >
                {mascota.nombre}
              </Text>
              <Text style={styles.firmaLine} />
              <Text style={styles.firmaLabel}>{mascota.nombre}</Text>
              <Text style={styles.cargoLabel}>Mascota</Text>
            </View>
          </View>

          {/* FECHA */}
          <Text style={styles.footer}>Morelia, Michoacán — {fecha}</Text>
        </View>
      </Page>
    </Document>
  );
}
