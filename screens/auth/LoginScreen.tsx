//   import { DarkTheme, LightTheme } from '@/constants/theme';
// import { useAuth } from '@/contexts/AuthContext';
// import { useLanguage } from '@/contexts/LanguageContext';
// import { useTheme } from '@/contexts/Theme';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { useState } from 'react';
// import {
//   Alert,
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';

//   interface LoginScreenProps {
//     onSwitchToSignUp: () => void;
//   }

//   export default function LoginScreen({ onSwitchToSignUp }: LoginScreenProps) {
//     const { theme } = useTheme();
//     const { t } = useLanguage();
//     const { signInWithEmail, signInWithGoogle, loading } = useAuth();
//     const currentTheme = theme === 'dark' ? DarkTheme : LightTheme;

//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [showPassword, setShowPassword] = useState(false);

//     const handleEmailLogin = async () => {
//       if (!email || !password) {
//         Alert.alert('Error', 'Please fill in all fields');
//         return;
//       }

//       try {
//         await signInWithEmail(email, password);
//       } catch (error) {
//         console.error('Login error:', error);
//       }
//     };

//     const handleGoogleLogin = async () => {
//       try {
//         await signInWithGoogle();
//       } catch (error) {
//         console.error('Google login error:', error);
//       }
//     };

//     return (
//       <KeyboardAvoidingView
//         style={[styles.container, { backgroundColor: currentTheme.background }]}
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       >
//         <ScrollView contentContainerStyle={styles.scrollContainer}>
//           {/* Header */}
//           <View style={styles.header}>
//             <Image
//               source={require('../../assets/images/logo.jpg')}
//               style={styles.logo}
//               resizeMode="contain"
//             />
//             <Text style={[styles.title, { color: currentTheme.text }]}>
//               {t('auth.welcomeBack')}
//             </Text>
//             <Text style={[styles.subtitle, { color: currentTheme.secondaryText }]}>
//               {t('auth.signInToContinue')}
//             </Text>
//           </View>

//           {/* Form */}
//           <View style={styles.form}>
//             {/* Email Input */}
//             <View style={styles.inputContainer}>
//               <MaterialCommunityIcons
//                 name="email-outline"
//                 size={20}
//                 color={currentTheme.secondaryText}
//                 style={styles.inputIcon}
//               />
//               <TextInput
//                 style={[styles.input, { color: currentTheme.text, borderColor: currentTheme.secondaryText }]}
//                 placeholder={t('auth.email')}
//                 placeholderTextColor={currentTheme.secondaryText}
//                 value={email}
//                 onChangeText={setEmail}
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//                 autoCorrect={false}
//               />
//             </View>

//             {/* Password Input */}
//             <View style={styles.inputContainer}>
//               <MaterialCommunityIcons
//                 name="lock-outline"
//                 size={20}
//                 color={currentTheme.secondaryText}
//                 style={styles.inputIcon}
//               />
//               <TextInput
//                 style={[styles.input, { color: currentTheme.text, borderColor: currentTheme.secondaryText }]}
//                 placeholder={t('auth.password')}
//                 placeholderTextColor={currentTheme.secondaryText}
//                 value={password}
//                 onChangeText={setPassword}
//                 secureTextEntry={!showPassword}
//               />
//               <TouchableOpacity
//                 onPress={() => setShowPassword(!showPassword)}
//                 style={styles.eyeIcon}
//               >
//                 <MaterialCommunityIcons
//                   name={showPassword ? 'eye-off' : 'eye'}
//                   size={20}
//                   color={currentTheme.secondaryText}
//                 />
//               </TouchableOpacity>
//             </View>

//             {/* Forgot Password */}
//             <TouchableOpacity style={styles.forgotPassword}>
//               <Text style={[styles.forgotPasswordText, { color: currentTheme.accent }]}>
//                 {t('auth.forgotPassword')}
//               </Text>
//             </TouchableOpacity>

//             {/* Login Button */}
//             <TouchableOpacity
//               style={[styles.loginButton, { backgroundColor: currentTheme.accent }]}
//               onPress={handleEmailLogin}
//               disabled={loading}
//             >
//               <Text style={styles.loginButtonText}>
//                 {loading ? t('common.loading') : t('auth.signIn')}
//               </Text>
//             </TouchableOpacity>

//             {/* Divider */}
//             <View style={styles.divider}>
//               <View style={[styles.dividerLine, { backgroundColor: currentTheme.secondaryText }]} />
//               <Text style={[styles.dividerText, { color: currentTheme.secondaryText }]}>
//                 {t('auth.or')}
//               </Text>
//               <View style={[styles.dividerLine, { backgroundColor: currentTheme.secondaryText }]} />
//             </View>

//             {/* Google Sign In */}
//             <TouchableOpacity
//               style={[styles.googleButton, { borderColor: currentTheme.secondaryText }]}
//               onPress={handleGoogleLogin}
//               disabled={loading}
//             >
//               <MaterialCommunityIcons name="google" size={20} color="#4285F4" />
//               <Text style={[styles.googleButtonText, { color: currentTheme.text }]}>
//                 {t('auth.signInWithGoogle')}
//               </Text>
//             </TouchableOpacity>
//           </View>

//           {/* Sign Up Link */}
//           <View style={styles.signUpContainer}>
//             <Text style={[styles.signUpText, { color: currentTheme.secondaryText }]}>
//               {t('auth.dontHaveAccount')}
//             </Text>
//             <TouchableOpacity onPress={onSwitchToSignUp}>
//               <Text style={[styles.signUpLink, { color: currentTheme.accent }]}>
//                 {t('auth.signUp')}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     );
//   }

//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//     },
//     scrollContainer: {
//       flexGrow: 1,
//       justifyContent: 'center',
//       paddingHorizontal: 24,
//       paddingVertical: 40,
//     },
//     header: {
//       alignItems: 'center',
//       marginBottom: 40,
//     },
//     logo: {
//       width: 80,
//       height: 80,
//       marginBottom: 20,
//     },
//     title: {
//       fontSize: 28,
//       fontWeight: 'bold',
//       marginBottom: 8,
//     },
//     subtitle: {
//       fontSize: 16,
//       textAlign: 'center',
//     },
//     form: {
//       marginBottom: 30,
//     },
//     inputContainer: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       marginBottom: 16,
//       position: 'relative',
//     },
//     inputIcon: {
//       position: 'absolute',
//       left: 16,
//       zIndex: 1,
//     },
//     input: {
//       flex: 1,
//       height: 56,
//       borderWidth: 1,
//       borderRadius: 12,
//       paddingLeft: 50,
//       paddingRight: 16,
//       fontSize: 16,
//     },
//     eyeIcon: {
//       position: 'absolute',
//       right: 16,
//       zIndex: 1,
//     },
//     forgotPassword: {
//       alignSelf: 'flex-end',
//       marginBottom: 24,
//     },
//     forgotPasswordText: {
//       fontSize: 14,
//       fontWeight: '500',
//     },
//     loginButton: {
//       height: 56,
//       borderRadius: 12,
//       justifyContent: 'center',
//       alignItems: 'center',
//       marginBottom: 24,
//     },
//     loginButtonText: {
//       color: 'white',
//       fontSize: 16,
//       fontWeight: '600',
//     },
//     divider: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       marginBottom: 24,
//     },
//     dividerLine: {
//       flex: 1,
//       height: 1,
//     },
//     dividerText: {
//       marginHorizontal: 16,
//       fontSize: 14,
//     },
//     googleButton: {
//       height: 56,
//       borderWidth: 1,
//       borderRadius: 12,
//       flexDirection: 'row',
//       alignItems: 'center',
//       justifyContent: 'center',
//       gap: 12,
//     },
//     googleButtonText: {
//       fontSize: 16,
//       fontWeight: '500',
//     },
//     signUpContainer: {
//       flexDirection: 'row',
//       justifyContent: 'center',
//       alignItems: 'center',
//     },
//     signUpText: {
//       fontSize: 14,
//     },
//     signUpLink: {
//       fontSize: 14,
//       fontWeight: '600',
//       marginLeft: 4,
//     },
//   });
